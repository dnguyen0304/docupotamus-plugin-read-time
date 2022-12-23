import Box from '@mui/material/Box';
import * as React from 'react';
import Metric from '../../Card/Metric';
import MetricDelta from '../../Card/MetricDelta';
import Rank from '../../Card/Rank';
import StyledListItem from '../../StyledListItem';
import type { CardProps } from '../../types';

export default function Card(
    {
        targetId,
        currRank,
        prevRank,
        details,
        readTimeSecond,
        showMinute,
    }: CardProps
): JSX.Element {
    // TODO(dnguyen0304): Hide targetId and use shortened
    // heading as the card symbol.
    const truncatedTargetId = targetId.split('-')[0];

    return (
        <StyledListItem>
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
