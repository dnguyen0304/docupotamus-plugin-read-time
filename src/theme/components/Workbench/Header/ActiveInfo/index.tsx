import * as React from 'react';
import type { Sample as WorkbenchSample } from '../../types';
import Item from './Item';

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
        <div style={{
            height: '25px',
            overflow: 'hidden',
        }}>
            <div style={{
                transition: 'translate 0.4s ease-in',
                translate: `0  -${(clickedIndex ? clickedIndex : 0) * 25}px`,
            }}>
                {keyedSamples.map((keyedSample) => {
                    const [targetId, sample, rankCurr] = keyedSample;
                    const rankPrev = targetIdToPrevRank.get(targetId);
                    return (
                        <Item
                            rankCurr={rankCurr}
                            rankPrev={rankPrev}
                            readTimeSecond={sample.runningTotal.readTimeSecond}
                            showMinute={showMinute}
                        />
                    );
                })}
            </div>
        </div>
    );
};
