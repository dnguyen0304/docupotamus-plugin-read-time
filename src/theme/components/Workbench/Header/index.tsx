import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Card from '../Card';
import { CARD_KEY_PREFIX } from '../constants';
import type { Sample as WorkbenchSample } from '../types';

const StyledBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 'var(--border-radius) 0 var(--space-s) var(--space-s)',
    // backgroundColor: 'white'
    // padding: 'var(--space-xs)',
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
                        details={sample.target.snippet}
                        readTimeSecond={sample.runningTotal.readTimeSecond}
                        showMinute={showMinute}
                    />
                );
            })}
        </StyledBox>
    );
};
