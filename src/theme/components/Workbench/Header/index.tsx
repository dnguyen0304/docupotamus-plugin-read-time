import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Color from 'color';
import * as React from 'react';
import { CardText as CardTextStyles } from '../styles';
import type { Sample as WorkbenchSample } from '../types';
import ActiveInfo from './ActiveInfo';
import Cards from './Cards';

export const HEIGHT: React.CSSProperties['height'] = '25%';

const StyledBox = styled(Box)(({ theme }) => ({
    ...CardTextStyles,
    height: HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    background: `linear-gradient(
        to bottom,
        ${theme.palette.grey[600]} 0%,
        ${Color(theme.palette.grey[800]).fade(0.3)} 50%)`,
    borderRadius: 'var(--border-radius) 0 var(--space-s) var(--space-s)',
    padding: 'var(--space-xs)',
    paddingTop: 'var(--space-xl)',
}));

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
            <ActiveInfo
                keyedSamples={keyedSamples}
                targetIdToPrevRank={targetIdToPrevRank}
                showMinute={showMinute}
                clickedIndex={clickedIndex}
            />
        </StyledBox>
    );
};
