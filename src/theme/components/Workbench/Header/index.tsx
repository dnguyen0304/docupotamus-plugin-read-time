import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import type { Sample as WorkbenchSample } from '../types';
import Cards from './Cards';

const StyledBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 'var(--border-radius) 0 var(--space-s) var(--space-s)',
    padding: 'var(--space-xs)',
    // backgroundColor: 'white',
});

interface Props {
    readonly keyedSamples: readonly (readonly [
        string,
        WorkbenchSample,
        number,
    ])[];
    readonly targetIdToPrevRank: ReadonlyMap<string, number>;
    readonly showMinute: boolean;
};

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
                clickedIndex={clickedIndex}
                setClickedIndex={setClickedIndex}
            />
            {/* TODO(dnguyen0304): Add real implementation for ActiveInfo. */}
            <div />
        </StyledBox>
    );
};
