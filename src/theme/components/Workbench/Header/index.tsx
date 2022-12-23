import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { CARD_KEY_PREFIX } from '../constants';
import type { Sample as WorkbenchSample } from '../types';
import Card from './Card';

const StyledBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 'var(--border-radius) 0 var(--space-s) var(--space-s)',
    padding: 'var(--space-xs)',
    // backgroundColor: 'white',
});

const getColor = (index: number): string => {
    switch (index) {
        case 0:
            return 'gold';
        case 1:
            return 'silver';
        case 2:
            return 'sandybrown';
        default:
            return 'transparent';
    }
};

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
    return (
        <StyledBox>
            {keyedSamples.map((keyedSample, i) => {
                const [targetId, sample, rankCurr] = keyedSample;
                const rankPrev = targetIdToPrevRank.get(targetId);
                return (
                    <Card
                        key={`${CARD_KEY_PREFIX}-${targetId}`}
                        targetId={targetId}
                        rankCurr={rankCurr}
                        rankPrev={rankPrev ? rankPrev : rankCurr}
                        rankColor={`var(--space-3xs) solid ${getColor(i)}`}
                        details={sample.target.snippet}
                        readTimeSecond={sample.runningTotal.readTimeSecond}
                        showMinute={showMinute}
                    />
                );
            })}
        </StyledBox>
    );
};
