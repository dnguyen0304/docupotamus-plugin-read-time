import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Cards from './Cards';

const StyledBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 'var(--border-radius) 0 var(--space-s) var(--space-s)',
    padding: 'var(--space-xs)',
    // backgroundColor: 'white',
});

export default function Header(
    {
        keyedSamples,
        targetIdToPrevRank,
        showMinute,
    }: React.ComponentProps<typeof Cards>
): JSX.Element {
    return (
        <StyledBox>
            <Cards
                keyedSamples={keyedSamples}
                targetIdToPrevRank={targetIdToPrevRank}
                showMinute={showMinute}
            />
            {/* TODO(dnguyen0304): Add real implementation for ActiveInfo. */}
            <div />
        </StyledBox>
    );
};
