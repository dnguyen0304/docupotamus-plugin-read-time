import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import useFlicker from '../hooks/useFlicker';
import useHighlight from '../hooks/useHighlight';
import BaseStyledListItem from '../StyledListItem';
import { CardProps } from '../types';
import Metric from './Metric';
import MetricDelta from './MetricDelta';
import Rank from './Rank';

const StyledListItem = styled(BaseStyledListItem)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
});

export default function Card(
    {
        className,
        targetId,
        rankCurr,
        rankPrev,
        details,
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
            <Box sx={{ margin: '0 6px 0 4px' }}>
                <Box>{truncatedTargetId}</Box>
                <Box style={{ fontSize: 'var(--font-size--3)' }}>
                    {details}
                </Box>
            </Box>
            <Metric
                readTimeSecond={readTimeSecond}
                showMinute={showMinute}
                sx={{ textAlign: 'right' }}
            />
            <MetricDelta readTimeSecond={readTimeSecond} />
        </StyledListItem>
    );
};
