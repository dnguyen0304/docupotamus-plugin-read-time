import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { ACTIVE_INFO_ITEM_HEIGHT } from '../../constants';
import type { Sample as WorkbenchSample } from '../../types';
import Item from './Item';

const KEY_PREFIX: string = 'activeInfoItem';
// TODO(dnguyen0304): Investigate extracting to a centralized location to
// facilitate maintenance.
const INFIMA_OVERRIDE_OL = {
    marginBottom: 0,
    paddingLeft: 0,
};

const StyledBox = styled(Box)({
    height: ACTIVE_INFO_ITEM_HEIGHT,
    marginTop: 'auto',
    overflow: 'hidden',
});

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
        <StyledBox>
            <ol style={{
                ...INFIMA_OVERRIDE_OL,
                transition: 'translate 0.4s ease-in',
                // Keep the -1 factor separate to code defensively against the
                // unpredictable CSS width property.
                translate:
                    `0 calc(-1 * ${clickedIndex} * ${ACTIVE_INFO_ITEM_HEIGHT})`,
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
        </StyledBox>
    );
};
