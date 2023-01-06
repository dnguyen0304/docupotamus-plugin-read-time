import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import getPercentile from 'percentile';
import * as React from 'react';
import { usePercentile } from '../../../contexts/percentile';
import type {
    RunningTotalSample,
    TargetIdToSamples
} from '../../../contexts/samples';
import { useSamples } from '../../../contexts/samples';
import { useToolbar } from '../../../contexts/toolbar';
import { CONTENT_MARGIN_LEFT } from './constants';
import Content from './Content';
import type { ChipData } from './Footer';
import Footer from './Footer';
import Header from './Header';
import Loading from './Loading';
import styles from './styles.module.css';
import type {
    KeyedSample,
    Percentile,
    Sample as WorkbenchSample
} from './types';

const MILLISECOND_TO_SECOND: number = 1000;
const HEADER_CARD_COUNT: number = 3;

interface BoundedPercentileRank {
    // Lower bound. This range endpoint is inclusive: [lower, upper).
    readonly lower: number;

    // Upper bound. This range endpoint is exclusive: [lower, upper).
    readonly upper: number;
}

interface StyledBoxProps {
    readonly workbenchIsOpen: boolean;
    readonly boxShadowWidth: React.CSSProperties['width'];
};

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'workbenchIsOpen' && prop !== 'boxShadowWidth',
})<StyledBoxProps>(({ theme, workbenchIsOpen, boxShadowWidth }) => ({
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: workbenchIsOpen ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    background: `linear-gradient(
        to right,
        ${theme.palette.grey[600]} 0%,
        ${theme.palette.grey[700]} 80%)`,
    borderTopLeftRadius: 'var(--space-l-xl)',
    paddingBottom: 'var(--space-xs)',
    // TODO(dnguyen0304): Investigate refactoring to box-shadow style to reduce
    // complexity.
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: `calc(-1 * ${boxShadowWidth})`,
        width: boxShadowWidth,
        height: '100vh',
        background: `linear-gradient(
            to right,
            transparent,
            rgba(60, 64, 67, 0.15) 70%,
            rgba(60, 64, 67, 0.4) 100%)`,
    },
}));

const convertToBoundedRanks = (
    ranks: readonly number[],
): readonly BoundedPercentileRank[] => {
    // Include the smallest and largest possible ranks.
    const unique = new Set<number>(ranks);
    unique.add(0);
    unique.add(100);

    const sorted = [...unique].sort((a, b) => a - b);

    // It is safe to start the iteration at index 1. There are _always_ at least
    // 2 items, that being the smallest and largest possible ranks.
    let bounded: BoundedPercentileRank[] = [];
    for (let i = 1; i < sorted.length; ++i) {
        bounded.push({
            lower: sorted[i - 1],
            upper: sorted[i],
        })
    }
    return bounded;
};

const getPercentileScores = (
    boundedRanks: readonly BoundedPercentileRank[],
    values: readonly number[],
): readonly Percentile[] => {
    if (values.length === 0) {
        return [];
    }
    return boundedRanks.map((boundedRank) => {
        const {
            lower: rankLower,
            upper: rankUpper,
        } = boundedRank;
        const [scoreLower, scoreUpper] =
            getPercentile([rankLower, rankUpper], [...values]) as number[];
        return {
            rank: rankUpper,
            scoreLower,
            scoreUpper,
        };
    });
};

// Convert from keyed RunningTotalSample to keyed WorkbenchSample.
const convertToWorkbenchSample = (
    [targetId, sample]: readonly [string, RunningTotalSample]
): readonly [string, WorkbenchSample] => {
    const readTimeSecond = Math.round(
        sample.runningTotal.visibleTimeMilli / MILLISECOND_TO_SECOND
    );
    return [
        targetId,
        {
            target: sample.target,
            runningTotal: {
                readTimeSecond,
                lastSample: sample.runningTotal.lastSample,
            },
            isHidden: false,
        },
    ];
};

// Sort keyed samples in descending order based on readTimeSecond then targetId.
const sortDescending = (
    a: readonly [string, WorkbenchSample],
    b: readonly [string, WorkbenchSample],
): number => {
    const visibleTimeA = a[1].runningTotal.readTimeSecond;
    const visibleTimeB = b[1].runningTotal.readTimeSecond;
    let criteria = visibleTimeB - visibleTimeA;
    if (visibleTimeA === visibleTimeB) {
        // Use all lowercase to ignore casing.
        const nameA = a[0].toLowerCase();
        const nameB = b[0].toLowerCase();
        if (nameA < nameB) {
            criteria = -1;
        } else if (nameA > nameB) {
            criteria = 1;
        }
    }
    return criteria;
};

// Rank keyed samples based on readTimeSecond.
const rank = (
    keyedSamples: readonly (readonly [string, WorkbenchSample])[],
): readonly KeyedSample[] => {
    if (!keyedSamples.length) {
        return [];
    }
    const ranks: KeyedSample[] = [];
    let currRank = 1;  // Use 1-indexed instead of 0-indexed ranks.
    let prevRankCount = 0;
    let prevReadTime = keyedSamples[0][1].runningTotal.readTimeSecond;
    for (let i = 0; i < keyedSamples.length; i++) {
        const [targetId, sample] = keyedSamples[i];
        const {
            runningTotal: {
                readTimeSecond: currReadTime,
            },
        } = sample;
        if (prevReadTime === currReadTime) {
            ++prevRankCount;
            ranks.push([targetId, sample, currRank]);
        } else if (prevReadTime > currReadTime) {
            currRank = currRank + prevRankCount;
            prevRankCount = 1;
            prevReadTime = currReadTime;
            ranks.push([targetId, sample, currRank]);
        } else if (prevReadTime < currReadTime) {
            throw new Error(
                'expected keyedSamples to be sorted in descending order'
            );
        }
    }
    return ranks;
};

const hideFirstN = (
    keyedSamples: readonly KeyedSample[],
    n: number = HEADER_CARD_COUNT,
) => {
    for (let i = 0; i < Math.min(n, keyedSamples.length); ++i) {
        keyedSamples[i][1].isHidden = true;
    }
};

const hideLastN = (
    keyedSamples: readonly KeyedSample[],
    n: number = HEADER_CARD_COUNT,
) => {
    for (let i = Math.max(0, keyedSamples.length - n); i < keyedSamples.length; ++i) {
        keyedSamples[i][1].isHidden = true;
    }
};

// TODO(dnguyen0304): [medium] Investigate moving rank to WorkbenchSample as
// Metadata.rankCurr for scalability.
const preprocess = (
    targetIdToSamples: TargetIdToSamples,
    unboundedPercentileRanks: readonly number[],
    isAscending: boolean,
    setMinRank: React.Dispatch<React.SetStateAction<number>>,
    setMinScore: React.Dispatch<React.SetStateAction<number>>,
): {
    readonly percentiles: readonly Percentile[];
    readonly keyedSamples: readonly KeyedSample[];
    readonly top: readonly KeyedSample[];
    readonly remaining: readonly KeyedSample[];
} => {
    const sorted =
        Object.entries(targetIdToSamples)
            .map(convertToWorkbenchSample)
            .sort((a, b) => sortDescending(a, b));
    const sortedAndRanked = rank(sorted);

    let preprocessed: readonly KeyedSample[] = [];
    let top: readonly KeyedSample[] = [];
    let remaining: readonly KeyedSample[] = [];
    let percentileRanks = [...convertToBoundedRanks(unboundedPercentileRanks)];

    setMinRank(percentileRanks[0].upper);
    setMinScore(
        (sorted.length !== 0)
            ? sorted[sorted.length - 1][1].runningTotal.readTimeSecond
            : 0
    );

    // TODO(dnguyen0304): Fix confusing ascending vs. descending convention.
    // Warning: Using isAscending anywhere else is strongly discouraged because
    // doing so adds significant maintenance costs.
    if (isAscending) {
        preprocessed = sortedAndRanked.slice().reverse();
        top = preprocessed.slice(-3);
        remaining = preprocessed.slice(0, -3);
        hideLastN(preprocessed);
    } else {
        preprocessed = sortedAndRanked;
        top = preprocessed.slice(0, 3);
        remaining = preprocessed.slice(3);
        percentileRanks.reverse();
        hideFirstN(preprocessed);
    }

    const percentiles = getPercentileScores(
        percentileRanks,
        preprocessed.map(
            ([, sample,]) => sample.runningTotal.readTimeSecond
        ),
    );

    return {
        percentiles,
        keyedSamples: preprocessed,
        top,
        remaining,
    };
};

const Partitioned = (): JSX.Element => {
    const {
        percentile: {
            ranks: unboundedRanks,
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
            .docupotamusReadTimePlugin;

    const { targetIdToSamples } = useSamples();
    const { setMinRank, setMinScore } = usePercentile();

    const targetIdToPrevRank = React.useRef<Map<string, number>>(new Map());
    const [isAscending, setIsAscending] = React.useState<boolean>(false);
    const [showMinute, setShowMinute] = React.useState<boolean>(false);
    const [hideUnread, setHideUnread] = React.useState<boolean>(false);

    const [percentiles, setPercentiles] = React.useState<Percentile[]>([]);
    const [keyedSamples, setKeyedSamples] = React.useState<KeyedSample[]>([]);
    const [top, setTop] = React.useState<KeyedSample[]>([]);
    const [remaining, setRemaining] = React.useState<KeyedSample[]>([]);

    const chips: readonly ChipData[] = React.useMemo(() => [
        {
            label: 'Sort Ascending',
            isClicked: isAscending,
            onClick: () => setIsAscending(prev => !prev),
        },
        {
            // TODO(dnguyen0304): Investigate renaming to "Minutes Format".
            label: 'Show Minutes',
            isClicked: showMinute,
            onClick: () => setShowMinute(prev => !prev),
        },
        {
            label: 'Hide Unread',
            isClicked: hideUnread,
            onClick: () => setHideUnread(prev => !prev),
        },
    ], []);

    React.useEffect(() => {
        const { percentiles, keyedSamples, top, remaining } = preprocess(
            targetIdToSamples,
            unboundedRanks,
            isAscending,
            setMinRank,
            setMinScore,
        );
        setPercentiles([...percentiles]);
        setKeyedSamples([...keyedSamples]);
        setTop([...top]);
        setRemaining([...remaining]);
    }, [targetIdToSamples]);

    // TODO(dnguyen0304): Add real implementation for rank tracking.
    React.useEffect(() => {
        const existingKeys = Array.from(targetIdToPrevRank.current.keys());
        const targetIds = Object.keys(targetIdToSamples);
        if (existingKeys.length === targetIds.length) {
            return;
        }
        for (const targetId of targetIds) {
            const prevRank = targetIdToPrevRank.current.get(targetId);
            if (prevRank) {
                continue;
            }
            targetIdToPrevRank.current.set(
                targetId,
                // Use 1-indexed instead of 0-indexed ranks.
                Math.floor(Math.random() * targetIds.length + 1) + 1,
            );
        }
    }, [targetIdToSamples]);

    return (
        <>
            <Header
                keyedSamples={top}
                targetIdToPrevRank={targetIdToPrevRank.current}
                showMinute={showMinute}
            />
            <Content
                keyedSamples={keyedSamples}
                targetIdToPrevRank={targetIdToPrevRank.current}
                showMinute={showMinute}
                hideUnread={hideUnread}
                percentiles={percentiles}
            />
            <Footer
                chips={chips}
                marginLeft={CONTENT_MARGIN_LEFT}
            />
        </>
    );
};

export default function Workbench(): JSX.Element {
    const {
        debug: {
            loading: {
                isEnabled: loadingIsEnabled,
            },
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
            .docupotamusReadTimePlugin;

    const location = useLocation();
    const { workbenchIsOpen } = useToolbar();
    const [isLoading, setIsLoading] = React.useState<boolean>(loadingIsEnabled);

    React.useEffect(() => {
        if (!loadingIsEnabled) {
            return;
        }
        setIsLoading(true);
    }, [location]);

    return (
        <StyledBox
            className={isLoading ? styles.workbench_container__load : ''}
            workbenchIsOpen={workbenchIsOpen}
            boxShadowWidth='var(--space-xs)'
        >
            {
                isLoading
                    ? <Loading setIsLoading={setIsLoading} />
                    : <Partitioned />
            }
        </StyledBox>
    );
};
