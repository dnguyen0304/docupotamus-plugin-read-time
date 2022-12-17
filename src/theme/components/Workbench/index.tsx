import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import type { RunningTotalSample } from '../../../contexts/samples';
import { useSamples } from '../../../contexts/samples';
import { useToolbar } from '../../../contexts/toolbar';
import { RunningTotal, Target } from '../../../docusaurus-plugin-read-time';
import Card from './Card';
import type { ChipData } from './Footer';
import Footer from './Footer';

const KEY_PREFIX: string = 'workbenchCard';
const MILLISECOND_TO_SECOND: number = 1000;

interface Sample {
    readonly target: Target;
    readonly runningTotal: {
        readonly readTimeSecond: number;
    } & Omit<RunningTotal, 'visibleTimeMilli'>;
};

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
    borderTopLeftRadius: 'var(--space-2xs)',
    // TODO(dnguyen0304): Add paddingRight for the scrollbar.
    padding: 'var(--space-xs) var(--space-s)',
    // TODO(dnguyen0304): Investigate refactoring to box-shadow
    // style to reduce complexity.
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
    '& > *': {
        marginBottom: 'var(--space-xs)',
    },
});

interface Props { };

export default function Workbench(
    {
    }: Props
): JSX.Element {
    const { workbenchIsOpen } = useToolbar();
    const { targetIdToSamples } = useSamples();

    const [isAscending, setIsAscending] = React.useState<boolean>(false);
    // TODO(dnguyen0304): Investigate renaming to "Minutes Format".
    const [seeMinute, setSeeMinute] = React.useState<boolean>(false);

    const chips: ChipData[] = [
        {
            label: 'Sort Ascending',
            isClicked: isAscending,
            onClick: () => setIsAscending(prev => !prev),
        },
        {
            label: 'See Minutes',
            isClicked: seeMinute,
            onClick: () => setSeeMinute(prev => !prev),
        },
    ];

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

    const sort = (
        a: readonly [string, Sample],
        b: readonly [string, Sample],
        isAscending: boolean,
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
        return criteria * (isAscending ? -1 : 1);
    };

    return (
        // TODO(dnguyen0304): Migrate to use MUI List.
        //   See: https://mui.com/material-ui/react-list/
        <StyledBox
            workbenchIsOpen={workbenchIsOpen}
            boxShadowWidth={'var(--space-xs)'}
        >
            <StyledOrderedList>
                {Object.entries(targetIdToSamples)
                    .map(convertToSecond)
                    .sort((a, b) => sort(a, b, isAscending))
                    .map(([targetId, sample], i) => {
                        return (
                            <Card
                                key={`${KEY_PREFIX}-${targetId}`}
                                targetId={targetId}
                                currRank={i + 1}
                                details={sample.target.snippet}
                                readTimeSecond={
                                    sample
                                        .runningTotal
                                        .readTimeSecond
                                }
                                seeMinute={seeMinute}
                            />
                        );
                    })}
            </StyledOrderedList>
            <Footer chips={chips} />
        </StyledBox>
    );
};
