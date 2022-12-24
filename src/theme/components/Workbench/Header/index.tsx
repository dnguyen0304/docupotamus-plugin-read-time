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

interface Props extends Omit<
    React.ComponentProps<typeof Cards>,
    'clickedIndex' | 'setClickedIndex'
> { };

export default function Header(
    {
        keyedSamples,
        targetIdToPrevRank,
        showMinute,
    }: Props
): JSX.Element {
    const [clickedIndex, setClickedIndex] = React.useState<number>(0);

    return (
        <StyledBox>
            <Cards
                keyedSamples={keyedSamples}
                targetIdToPrevRank={targetIdToPrevRank}
                showMinute={showMinute}
                clickedIndex={clickedIndex}
                setClickedIndex={setClickedIndex}
            />
            {/* TODO(dnguyen0304): Add real implementation for ActiveInfo. */}
            <div />
        </StyledBox>
    );
};
