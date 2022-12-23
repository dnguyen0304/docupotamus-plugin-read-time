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
            {keyedSamples.map((keyedSample) => {
                const [targetId, sample, currRank] = keyedSample;
                const prevRank = targetIdToPrevRank.get(targetId);
                return (
                    <Card
                        key={`${CARD_KEY_PREFIX}-${targetId}`}
                        targetId={targetId}
                        currRank={currRank}
                        prevRank={prevRank ? prevRank : currRank}
                        rankColor='4px solid gold'
                        details={sample.target.snippet}
                        readTimeSecond={sample.runningTotal.readTimeSecond}
                        showMinute={showMinute}
                    />
                );
            })}
        </StyledBox>
    );
};
