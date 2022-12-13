import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useSamples } from '../../../contexts/samples';
import { useToolbar } from '../../../contexts/toolbar';
import Card from './Card';

const KEY_PREFIX: string = 'workbenchCard';
const MILLISECOND_TO_MINUTE: number = 60 * 1000;
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
    alignItems: 'center',
    background: `linear-gradient(
        to bottom,
        ${theme.palette.grey[600]} 0%,
        ${theme.palette.grey[700]} 100%)`,
    borderTopLeftRadius: 'var(--space-2xs)',
    // TODO(dnguyen0304): Add overflow to scroll through cards. However, this
    // breaks the box-shadow.
    // overflow: 'scroll',
    padding: 'var(--space-xs) var(--space-2xs)',
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
    width: '100%',
    margin: 0,
    padding: 0,
    '& > *': {
        marginBottom: 'var(--space-xs)',
    },
    '& > *:last-child': {
        marginBottom: 0,
    },
});

interface Props { };

export default function Workbench(
    {
    }: Props
): JSX.Element {
    const { workbenchIsOpen } = useToolbar();
    const { targetIdToSamples } = useSamples();

    return (
        // TODO(dnguyen0304): Migrate to use MUI List.
        //   See: https://mui.com/material-ui/react-list/
        <StyledBox
            workbenchIsOpen={workbenchIsOpen}
            boxShadowWidth={'var(--space-xs)'}
        >
            <StyledOrderedList>
                {Object.entries(targetIdToSamples).map(
                    ([targetId, sample], i) => {
                        // TODO(dnguyen0304): Hide targetId and use shortened
                        // heading as the card symbol.
                        const truncatedTargetId = targetId.split('-')[0];
                        const minute = Math.floor(
                            sample.runningTotal.visibleTimeMilli
                            / MILLISECOND_TO_MINUTE);
                        const second = Math.round(
                            (sample.runningTotal.visibleTimeMilli % 60000)
                            / MILLISECOND_TO_SECOND);
                        return (
                            <Card
                                key={`${KEY_PREFIX}-${i}`}
                                targetId={truncatedTargetId}
                                details={sample.target.selectors[0].startContainer}
                                readTime={{
                                    minute,
                                    second,
                                }}
                            />
                        );
                    })}
            </StyledOrderedList>
        </StyledBox>
    );
};
