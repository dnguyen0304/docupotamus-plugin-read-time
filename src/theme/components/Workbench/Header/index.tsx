import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Color from 'color';
import * as React from 'react';
import { CardText as CardTextStyles } from '../styles';
import type { Sample as WorkbenchSample } from '../types';
import ActiveInfo from './ActiveInfo';
import Cards from './Cards';

const StyledBox = styled(Box)(({ theme }) => ({
    ...CardTextStyles,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: `linear-gradient(
        355deg,
        ${theme.palette.grey[600]} 0%,
        ${theme.palette.grey[700]} 30%,
        ${Color(theme.palette.grey[800]).fade(0.6)} 100%)`,
    borderTopLeftRadius: 'inherit',
    borderBottomRightRadius: 'var(--space-xl)',
    marginBottom: 'var(--space-xs)',
    padding: 'var(--space-l) var(--space-xs) var(--space-m)',
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
