import Box from '@mui/material/Box';
import * as React from 'react';
import type { Sample as WorkbenchSample } from '../../types';
import Item from './Item';

const KEY_PREFIX: string = 'activeInfoItem';

interface Props {
    readonly keyedSamples: readonly (readonly [
        string,
        WorkbenchSample,
        number,
    ])[];
    readonly targetIdToPrevRank: ReadonlyMap<string, number>;
    readonly showMinute: boolean;
    readonly clickedIndex: number;
};

export default function ActiveInfo(
    {
        keyedSamples,
        targetIdToPrevRank,
        showMinute,
        clickedIndex,
    }: Props
): JSX.Element | null {
    if (keyedSamples.length <= clickedIndex) {
        return null;
    }

    return (
        <Box sx={{
            height: '25px',
            overflow: 'hidden',
        }}>
            <ol style={{
                transition: 'translate 0.4s ease-in',
                translate: `0 -${(clickedIndex ? clickedIndex : 0) * 25}px`,
            }}>
                {keyedSamples.map((keyedSample) => {
                    const [targetId, sample, rankCurr] = keyedSample;
                    const rankPrev = targetIdToPrevRank.get(targetId);
                    return (
                        <Item
                            key={`${KEY_PREFIX}-${targetId}`}
                            rankCurr={rankCurr}
                            rankPrev={rankPrev}
                            readTimeSecond={sample.runningTotal.readTimeSecond}
                            showMinute={showMinute}
                        />
                    );
                })}
            </ol>
        </Box>
    );
};
