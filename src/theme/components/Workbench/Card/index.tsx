import Box from '@mui/material/Box';
import * as React from 'react';
import useFlicker from '../hooks/useFlicker';
import useHighlight from '../hooks/useHighlight';
import StyledListItem from '../StyledListItem';
import Metric from './Metric';
import MetricDelta from './MetricDelta';
import Rank from './Rank';

interface Props {
    readonly className?: string;
    readonly targetId: string;
    readonly currRank: number;
    readonly prevRank: number;
    readonly details: string;
    readonly readTimeSecond: number;
    readonly showMinute: boolean;
};

export default function Card(
    {
        className,
        targetId,
        currRank,
        prevRank,
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
        >
            <Rank currRank={currRank} prevRank={prevRank} />
            <Box sx={{ margin: '0 6px 0 4px' }}>
                <Box>{truncatedTargetId}</Box>
                <Box style={{ fontSize: 'var(--font-size--3)' }}>
                    {details}
                </Box>
            </Box>
            <Metric readTimeSecond={readTimeSecond} showMinute={showMinute} />
            <MetricDelta readTimeSecond={readTimeSecond} />
        </StyledListItem>
    );
};
