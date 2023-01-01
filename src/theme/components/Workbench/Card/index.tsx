import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import useHighlight from '../hooks/useHighlight';
import usePulse from '../hooks/usePulse';
import useVisibility from '../hooks/useVisibility';
import { Card as CardStyles } from '../styles';
import { CardProps } from '../types';
import Metric from './Metric';
import Rank from './Rank';

const HighlightStyles = {
    // Set the margin-right style on the children li instead of the parent ol to
    // avoid overflow clipping the Delta.
    margin: '0 var(--space-2xs)',
    padding: 'var(--space-xs)',
    paddingRight: 'var(--space-s)',
    '&:hover': {
        // TODO(dnguyen0304): Extract to a centralized location to facilitate
        // maintenance.
        backgroundColor: 'rgb(252, 201, 53)',
        color: 'black',
        opacity: 1,
    },
}

interface StyledListItemProps {
    readonly targetIsVisible: boolean;
};

const StyledListItem = styled('li', {
    shouldForwardProp: (prop) => prop !== 'targetIsVisible',
})<StyledListItemProps>(({ targetIsVisible }) => ({
    ...CardStyles,
    ...HighlightStyles,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    opacity: 0.6,
    ...(targetIsVisible && {
        // TODO(dnguyen0304): Extract to a centralized location to facilitate
        // maintenance.
        backgroundColor: 'rgba(252, 201, 53, 0.08)',
        opacity: 1,
    }),
}));

export default function Card(
    {
        className,
        targetId,
        details,
        rankCurr,
        rankPrev,
        readTimeSecond,
        showMinute,
    }: CardProps
): JSX.Element {
    const [, setPulse] = usePulse(targetId);
    const [, setHighlight] = useHighlight(targetId);
    const targetIsVisible = useVisibility(targetId);

    // TODO(dnguyen0304): Hide targetId and use shortened
    // heading as the card symbol.
    const truncatedTargetId = targetId.split('-')[0];

    return (
        <StyledListItem
            className={className}
            targetIsVisible={targetIsVisible}
            onAnimationEnd={() => setPulse(false)}
            onClick={() => setPulse(true)}
            onMouseEnter={() => setHighlight(true)}
            onMouseLeave={() => setHighlight(false)}
        >
            <Rank
                curr={rankCurr}
                prev={rankPrev}
                arrowPosition='bottom'
            />
            <Box sx={{
                // TODO(dnguyen0304): Investigate changing percentages to grid
                // layout for responsive design.
                width: '65%',
                margin: '0 6px 0 4px',
            }}>
                <Box>{truncatedTargetId}</Box>
                <Box sx={{ fontSize: 'var(--font-size--3)' }}>
                    {details}
                </Box>
            </Box>
            <Metric
                readTimeSecond={readTimeSecond}
                showMinute={showMinute}
                sx={{ textAlign: 'right' }}
                withDelta
            />
        </StyledListItem>
    );
};
