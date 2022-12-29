import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import useFlicker from '../hooks/useFlicker';
import useHighlight from '../hooks/useHighlight';
import { Card as CardStyles } from '../styles';
import { CardProps } from '../types';
import Metric from './Metric';
import Rank from './Rank';

const StyledListItem = styled('li')({
    ...CardStyles,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // Set the margin-right style on the children li instead of the parent ol to
    // avoid overflow clipping the Delta.
});

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
    const [, setFlicker] = useFlicker(targetId);
    const [, setHighlight] = useHighlight(targetId);

    // TODO(dnguyen0304): Hide targetId and use shortened
    // heading as the card symbol.
    const truncatedTargetId = targetId.split('-')[0];

    return (
        <StyledListItem
            className={className}
            onAnimationEnd={() => setFlicker(false)}
            onClick={() => setFlicker(true)}
            onMouseEnter={() => setHighlight(true)}
            onMouseLeave={() => setHighlight(false)}
        >
            <Rank
                curr={rankCurr}
                prev={rankPrev}
                arrowPosition='bottom'
            />
            <Box sx={{
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
