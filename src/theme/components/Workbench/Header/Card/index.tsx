import Box from '@mui/material/Box';
import * as React from 'react';
import Metric from '../../Card/Metric';
import MetricDelta from '../../Card/MetricDelta';
import Rank from '../../Card/Rank';
import useFlicker from '../../hooks/useFlicker';
import useHighlight from '../../hooks/useHighlight';
import StyledListItem from '../../StyledListItem';
import type { CardProps } from '../../types';

interface Props extends CardProps {
    rankColor: string;
};

export default function Card(
    {
        className,
        targetId,
        rankCurr,
        rankPrev,
        rankColor,
        details,
        readTimeSecond,
        showMinute,
    }: Props
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
            sx={{ borderTop: rankColor }}
        >
            <Box sx={{ margin: '0 6px 0 4px' }}>
                <Box>{truncatedTargetId}</Box>
                <Box style={{ fontSize: 'var(--font-size--3)' }}>
                    {details}
                </Box>
            </Box>
            <Rank
                curr={rankCurr}
                prev={rankPrev}
                arrowPosition='left'
            />
            <Metric
                readTimeSecond={readTimeSecond}
                showMinute={showMinute}
                sx={{ textAlign: 'center' }}
            />
            <MetricDelta readTimeSecond={readTimeSecond} />
        </StyledListItem>
    );
};
