import type {
    BandFriendlyKey,
    IntersectionSample,
    RunningTotal,
    StartIntersectionSample
} from '@docusaurus/plugin-read-time';
import type { TargetIdToSamples } from '../../../../contexts/samples';
import { BAND_FRIENDLY_KEYS } from '../config';

// stale closure can't use entry
function getIntersectionRatio(sample: IntersectionSample): number {
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

// TODO(dnguyen0304): [P1] Fix race condition dropping unprocessed samples due
//   to unsynchronized reads.
export function createUpdateRunningTotals(
    samples: Map<string, Map<BandFriendlyKey, IntersectionSample[]>>,
    setTargetIdToSamples:
        React.Dispatch<React.SetStateAction<TargetIdToSamples>>,
): () => void {
    const runningTotals: Map<string, Map<BandFriendlyKey, RunningTotal>> =
        new Map();

    return () => {
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

                setTargetIdToSamples(prev => ({
                    ...prev,
                    [targetId]: {
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
                    },
                }));
                samples.get(targetId)?.set(bandKey, []);
            }
        }
    };
};

function getRunningTotal(
    runningTotals: Map<string, Map<BandFriendlyKey, RunningTotal>>,
    targetId: string,
    bandKey: BandFriendlyKey,
): RunningTotal {
    const bandKeyToRunningTotal = runningTotals.get(targetId);
    if (!bandKeyToRunningTotal) {
        runningTotals.set(targetId, new Map<BandFriendlyKey, RunningTotal>(
            [...BAND_FRIENDLY_KEYS].map(bandKey => {
                return [bandKey, { visibleTimeMilli: 0, lastSample: null }];
            })
        ));
        return runningTotals.get(targetId)!.get(bandKey)!;
    }
    return bandKeyToRunningTotal.get(bandKey)!;
};
