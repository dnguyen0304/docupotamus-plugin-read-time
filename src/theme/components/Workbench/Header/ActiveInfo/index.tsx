import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Delta from '../../Card/Metric/Delta';
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
    position: 'relative',  // Create a context for Delta.
    width: 'fit-content',
    minWidth: '40%',
});

const ClippingBox = styled(Box)({
    height: ACTIVE_INFO_ITEM_HEIGHT,
    overflow: 'hidden',
});

interface StyledOrderedListProps {
    readonly clickedIndex: number;
};

const StyledOrderedList = styled('ol', {
    shouldForwardProp: (prop) => prop !== 'clickedIndex',
})<StyledOrderedListProps>(({ clickedIndex }) => ({
    ...INFIMA_OVERRIDE_OL,
    transition: 'translate 0.4s ease-in',
    // Keep the -1 factor separate to code defensively against the
    // unpredictable CSS width property.
    translate: `0 calc(-1 * ${clickedIndex} * ${ACTIVE_INFO_ITEM_HEIGHT})`,
}));

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
            <ClippingBox>
                <StyledOrderedList clickedIndex={clickedIndex}>
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
                </StyledOrderedList>
            </ClippingBox>
            <Delta
                readTimeSecond={
                    keyedSamples[clickedIndex][1]
                        .runningTotal
                        .readTimeSecond
                }
            />
        </StyledBox>
    );
};
