import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import type {
    RunningTotalSample,
    TargetIdToSamples
} from '../../../contexts/samples';
import { useSamples } from '../../../contexts/samples';
import { useToolbar } from '../../../contexts/toolbar';
import Card from './Card';
import { CARD_KEY_PREFIX } from './constants';
import type { ChipData } from './Footer';
import Footer from './Footer';
import Header from './Header';
import type { Sample } from './types';
const MILLISECOND_TO_SECOND: number = 1000;

interface StyledBoxProps {
    readonly workbenchIsOpen: boolean;
    readonly boxShadowWidth: string;
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
        to bottom,
        ${theme.palette.grey[600]} 0%,
        ${theme.palette.grey[700]} 100%)`,
    borderTopLeftRadius: 'var(--border-radius)',
    padding: 'var(--space-xs)',
    paddingRight: '0px',
    // TODO(dnguyen0304): Investigate refactoring to box-shadow style to reduce
    // complexity.
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '0',
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

const StyledOrderedList = styled('ol')({
    overflow: 'scroll',
    margin: 0,
    padding: 0,
});

// Convert from keyed RunningTotalSample to keyed WorkbenchSample.
const convertToSecond = (
    [targetId, sample]: readonly [string, RunningTotalSample]
): readonly [string, Sample] => {
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
        },
    ];
};

// Sort keyed samples in descending order based on readTimeSecond then targetId.
const sortDescending = (
    a: readonly [string, Sample],
    b: readonly [string, Sample],
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

export default function Workbench(): JSX.Element {
    const { workbenchIsOpen } = useToolbar();
    const { targetIdToSamples } = useSamples();

    const targetIdToPrevRank = React.useRef<Map<string, number>>(new Map());
    const [isAscending, setIsAscending] = React.useState<boolean>(false);
    // TODO(dnguyen0304): Investigate renaming to "Minutes Format".
    const [showMinute, setShowMinute] = React.useState<boolean>(false);

    const chips: readonly ChipData[] = [
        {
            label: 'Sort Ascending',
            isClicked: isAscending,
            onClick: () => setIsAscending(prev => !prev),
        },
        {
            label: 'Show Minutes',
            isClicked: showMinute,
            onClick: () => setShowMinute(prev => !prev),
        },
    ];

    const preprocess = (
        targetIdToSamples: TargetIdToSamples,
    ): (readonly [string, Sample, number])[] => {
        const sorted = Object.entries(targetIdToSamples)
            .map(convertToSecond)
            .sort((a, b) => sortDescending(a, b));
        const sortedAndRanked = rank(sorted);
        return (
            isAscending
                ? sortedAndRanked.slice().reverse()
                : sortedAndRanked
        );
    };

    const rank = (
        keyedSamples: (readonly [string, Sample])[],
    ): (readonly [string, Sample, number])[] => {
        if (!keyedSamples.length) {
            return [];
        }
        const ranks: (readonly [string, Sample, number])[] = [];
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

    const partitionCards = (): JSX.Element => {
        const preprocessed = preprocess(targetIdToSamples);
        let top: ReadonlyArray<(readonly [string, Sample, number])> = [];
        let remaining: ReadonlyArray<(readonly [string, Sample, number])> = [];

        if (isAscending) {
            top = preprocessed.slice(-3);
            remaining = preprocessed.slice(0, -3);
        } else {
            top = preprocessed.slice(0, 3);
            remaining = preprocessed.slice(3);
        }

        return (
            <>
                <Header
                    keyedSamples={top}
                    targetIdToPrevRank={targetIdToPrevRank.current}
                    showMinute={showMinute}
                />
                <StyledOrderedList>
                    {remaining.map((preprocessed) => {
                        const [targetId, sample, currRank] = preprocessed;
                        const prevRank = targetIdToPrevRank.current.get(targetId);
                        return (
                            <Card
                                key={`${CARD_KEY_PREFIX}-${targetId}`}
                                targetId={targetId}
                                currRank={currRank}
                                prevRank={prevRank ? prevRank : currRank}
                                details={sample.target.snippet}
                                readTimeSecond={sample.runningTotal.readTimeSecond}
                                showMinute={showMinute}
                            />
                        );
                    })}
                </StyledOrderedList>
            </>
        )
    };

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
        // TODO(dnguyen0304): Investigate migrating to use MUI List.
        //   See: https://mui.com/material-ui/react-list/
        <StyledBox
            workbenchIsOpen={workbenchIsOpen}
            boxShadowWidth={'var(--space-xs)'}
        >
            {partitionCards()}
            <Footer chips={chips} />
        </StyledBox>
    );
};
