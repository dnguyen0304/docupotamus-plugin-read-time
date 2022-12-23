import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import {
    CARD_BOX_SHADOW_INNER_WIDTH_REM,
    CARD_BOX_SHADOW_OUTER_WIDTH_REM
} from '../constants';
import useFlicker from '../hooks/useFlicker';
import useHighlight from '../hooks/useHighlight';
import Metric from './Metric';
import MetricDelta from './MetricDelta';
import Rank from './Rank';

const BOX_SHADOW_WIDTH_REM: number =
    CARD_BOX_SHADOW_INNER_WIDTH_REM + CARD_BOX_SHADOW_OUTER_WIDTH_REM;

const StyledListItem = styled('li')({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgb(48, 56, 70)',
    borderRadius: 'var(--border-radius)',
    color: '#fff',
    fontSize: 'var(--font-size--2)',
    margin: `${BOX_SHADOW_WIDTH_REM}rem`,
    // TODO(dnguyen0304): Investigate decreasing to have vertical symmetry with
    // Workbench padding-left style.
    marginRight: `calc(`
        + `${BOX_SHADOW_WIDTH_REM}rem`
        + ` + `
        + `var(--space-xs))`,
    padding: 'var(--space-2xs)',
    '&:hover': {
        boxShadow: `
            #fff 0 0 0 ${CARD_BOX_SHADOW_INNER_WIDTH_REM}rem,
            rgb(100, 255, 218) 0 0 0 ${CARD_BOX_SHADOW_OUTER_WIDTH_REM}rem`,
    },
});

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
