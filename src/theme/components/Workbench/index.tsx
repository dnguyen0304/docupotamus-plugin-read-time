import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import type { RunningTotalSample } from '../../../contexts/samples';
import { useSamples } from '../../../contexts/samples';
import { useToolbar } from '../../../contexts/toolbar';
import Card from './Card';
import type { ChipData } from './Footer';
import Footer from './Footer';

const KEY_PREFIX: string = 'workbenchCard';

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

    const sort = (
        a: [string, RunningTotalSample],
        b: [string, RunningTotalSample],
        isAscending: boolean,
    ): number => {
        return (
            (b[1].runningTotal.visibleTimeMilli
                - a[1].runningTotal.visibleTimeMilli)
            * (isAscending ? -1 : 1)
        );
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
                    .sort((a, b) => sort(a, b, isAscending))
                    .map(([targetId, sample]) =>
                        <Card
                            key={`${KEY_PREFIX}-${targetId}`}
                            targetId={targetId}
                            details={sample.target.snippet}
                            readTimeMilli={
                                sample
                                    .runningTotal
                                    .visibleTimeMilli}
                            seeMinute={seeMinute}
                        />
                    )}
            </StyledOrderedList>
            <Footer chips={chips} />
        </StyledBox>
    );
};
