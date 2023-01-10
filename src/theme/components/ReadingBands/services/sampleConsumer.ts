import type {
    BandFriendlyKey,
    IntersectionSample,
    RunningTotal,
    StartIntersectionSample
} from '@docusaurus/plugin-read-time';
import type {
    RunningTotalSample,
    TargetIdToSamples
} from '../../../../contexts/samples';
import { BAND_FRIENDLY_KEYS } from '../config';

const getRunningTotal = (
    runningTotals: Map<string, Map<BandFriendlyKey, RunningTotal>>,
    targetId: string,
    bandKey: BandFriendlyKey,
): RunningTotal => {
    const bandKeyToRunningTotal = runningTotals.get(targetId);
    if (!bandKeyToRunningTotal) {
        runningTotals.set(targetId, new Map<BandFriendlyKey, RunningTotal>(
            // Set a fallback for all bandKeys. The targetId was not found so
            // the corresponding bandKeys are also guaranteed to be not found.
            [...BAND_FRIENDLY_KEYS].map(bandKey => {
                return [bandKey, { visibleTimeMilli: 0, lastSample: null }];
            })
        ));
        return runningTotals.get(targetId)!.get(bandKey)!;
    }
    const runningTotal = bandKeyToRunningTotal.get(bandKey);
    if (!runningTotal) {
        // Set a fallback for only the specified bandKey. The targetId was found
        // so it's possible there are existing runningTotals that should not be
        // overwritten.
        bandKeyToRunningTotal.set(
            bandKey,
            { visibleTimeMilli: 0, lastSample: null },
        );
    }
    return bandKeyToRunningTotal.get(bandKey)!;
};

const getIntersectionRatio = (sample: IntersectionSample): number => {
    if (!sample.isIntersecting) {
        return 0;
    }
    const startSample = sample as StartIntersectionSample;

    const intersectingWidth = startSample.targetRect.width;
    let intersectingHeight: number = 0;

    const { viewportHeightPx } = startSample.deviceInfo;
    const bandTopPx = startSample.band.topVh * viewportHeightPx;
    const bandBottomPx = startSample.band.bottomVh * viewportHeightPx;

    const isInsideTop = startSample.targetRect.top >= bandTopPx;
    const isInsideBottom = startSample.targetRect.bottom < bandBottomPx;

    const insideBoth = isInsideTop && isInsideBottom;
    const outsideOnlyBottom = isInsideTop && !isInsideBottom;
    const outsideOnlyTop = !isInsideTop && isInsideBottom;
    const outsideBoth = !isInsideTop && !isInsideBottom;

    if (insideBoth) {
        intersectingHeight = startSample.targetRect.height;
    } else if (outsideOnlyBottom) {
        intersectingHeight = bandBottomPx - startSample.targetRect.top;
    } else if (outsideOnlyTop) {
        intersectingHeight = startSample.targetRect.bottom - bandTopPx;
    } else if (outsideBoth) {
        intersectingHeight = bandBottomPx - bandTopPx;
    }

    const intersectionRatio =
        (intersectingWidth * intersectingHeight) /
        (startSample.targetRect.width * startSample.targetRect.height);

    return intersectionRatio;
};

const getLocalStorageKey = (targetId: string, pathname: string): string => {
    return `${pathname}/${targetId}`;
};

const readLocalStorage = (
    pathname: string,
): Map<string, Map<BandFriendlyKey, RunningTotal>> => {
    const runningTotals = new Map();
    for (let i = 0; i < localStorage.length; ++i) {
        const key = localStorage.key(i) || '';
        if (!key.startsWith(pathname)) {
            continue;
        }
        const entry = localStorage.getItem(key);
        if (!entry) {
            continue;
        }
        const [targetId, sample] =
            JSON.parse(entry) as [string, RunningTotalSample];
        runningTotals.set(
            targetId,
            new Map<BandFriendlyKey, RunningTotal>([
                // TODO(dnguyen0304): Fix using an arbitrary bandKey because of
                //   data loss.
                ['B0', sample.runningTotal],
            ]),
        );
    }
    return runningTotals;
};

const updateLocalStorage = (
    targetIdToSamples: TargetIdToSamples,
    pathname: string,
) => {
    Object.entries(targetIdToSamples).forEach((entry) => {
        const [targetId,] = entry;
        localStorage.setItem(
            getLocalStorageKey(targetId, pathname),
            JSON.stringify(entry),
        );
    });
};

// TODO(dnguyen0304): [P1] Fix race condition dropping unprocessed samples due
//   to unsynchronized reads.
export const createUpdateRunningTotals = (
    samples: Map<string, Map<BandFriendlyKey, IntersectionSample[]>>,
    setTargetIdToSamples:
        React.Dispatch<React.SetStateAction<TargetIdToSamples>>,
    pathname: string,
): () => void => {
    const runningTotals: Map<string, Map<BandFriendlyKey, RunningTotal>> =
        readLocalStorage(pathname);

    return () => {
        const newTargetIdToSamples: { [key: string]: RunningTotalSample } = {};

        for (const [targetId, targetSamples] of samples) {
            for (const [bandKey, bandSamples] of targetSamples) {
                const runningTotal = getRunningTotal(
                    runningTotals,
                    targetId,
                    bandKey,
                );

                if (!runningTotal.lastSample && !bandSamples.length) {
                    continue;
                }

                // Considering the lastSample from the runningTotal as the
                // previously processed sample takes priority.
                let prevSample = runningTotal.lastSample || bandSamples[0];
                const remainingSamples =
                    (runningTotal.lastSample)
                        ? bandSamples
                        : bandSamples.slice(1);

                for (const bandSample of remainingSamples) {
                    const prevTimestampMilli = prevSample.timestampMilli;
                    const prevIntersectionRatio =
                        getIntersectionRatio(prevSample);
                    const currVisibleTime =
                        (bandSample.timestampMilli - prevTimestampMilli)
                        * prevIntersectionRatio
                        * bandSample.band.multiplier;
                    runningTotal.visibleTimeMilli += currVisibleTime;

                    prevSample = bandSample;
                }

                runningTotal.lastSample = prevSample;

                newTargetIdToSamples[targetId] = {
                    target: runningTotal.lastSample!.target,
                    runningTotal: {
                        visibleTimeMilli: Array
                            .from(runningTotals.get(targetId)!.values())
                            .reduce(
                                (accumulator, current) =>
                                    accumulator + current.visibleTimeMilli,
                                0
                            ),
                        lastSample: runningTotal.lastSample,
                    },
                };
                samples.get(targetId)?.set(bandKey, []);
            }
        }
        // Warning: Updating this state is the _most_ expensive call in the
        // entire app because it causes a re-calculation of all running totals
        // and a re-render of every Card.
        setTargetIdToSamples(prev => ({ ...prev, ...newTargetIdToSamples }));
        setTargetIdToSamples(prev => {
            updateLocalStorage(prev, pathname);
            return prev;
        });
    };
};
