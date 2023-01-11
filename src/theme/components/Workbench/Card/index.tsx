import Box from '@mui/material/Box';
import type { CSSObject } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import useElement from '../hooks/useElement';
import useHighlight from '../hooks/useHighlight';
import usePulse from '../hooks/usePulse';
import useVisibility from '../hooks/useVisibility';
import { Card as CardStyles } from '../styles';
import { CardProps } from '../types';
import Metric from './Metric';
import Rank from './Rank';
import Symbol from './Symbol';

const HighlightStyles: CSSObject = {
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
};

interface StyledListItemProps {
    readonly isHidden: boolean;
    readonly targetIsVisible: boolean;
};

const StyledListItem = styled('li', {
    shouldForwardProp: (prop) => prop !== 'isHidden' && prop !== 'targetIsVisible',
})<StyledListItemProps>(({ isHidden, targetIsVisible }) => ({
    ...CardStyles,
    ...HighlightStyles,
    position: 'relative',
    display: isHidden ? 'none' : 'flex',
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
        isHidden,
    }: CardProps
): JSX.Element {
    const element = useElement(targetId);
    const [, setPulse] = usePulse(element);
    const [, setHighlight] = useHighlight(element);
    const targetIsVisible = useVisibility(element);

    return (
        <StyledListItem
            className={className}
            isHidden={isHidden}
            onAnimationEnd={() => setPulse(false)}
            onClick={() => setPulse(true)}
            onMouseEnter={() => setHighlight(true)}
            onMouseLeave={() => setHighlight(false)}
            targetIsVisible={targetIsVisible}
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
                <Symbol />
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
