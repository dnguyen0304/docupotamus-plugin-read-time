import { styled } from '@mui/material/styles';
import * as React from 'react';
import Card from '../Card';
import { CARD_KEY_PREFIX } from '../constants';
import type { Sample as WorkbenchSample } from '../types';

// TODO(dnguyen0304): Investigate migrating to use MUI List.
//   See: https://mui.com/material-ui/react-list/
const StyledOrderedList = styled('ol')({
    overflow: 'scroll',
    margin: 0,
    marginBottom: 'var(--space-2xs)',
    padding: 0,
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

export default function Content(
    {
        keyedSamples,
        targetIdToPrevRank,
        showMinute,
    }: Props
): JSX.Element {
    return (
        <StyledOrderedList>
            {keyedSamples.map((preprocessed) => {
                const [targetId, sample, rankCurr] = preprocessed;
                const rankPrev = targetIdToPrevRank.get(targetId);
                return (
                    <Card
                        key={`${CARD_KEY_PREFIX}-${targetId}`}
                        targetId={targetId}
                        details={sample.target.snippet}
                        rankCurr={rankCurr}
                        rankPrev={rankPrev}
                        readTimeSecond={sample.runningTotal.readTimeSecond}
                        showMinute={showMinute}
                    />
                );
            })}
        </StyledOrderedList>
    );
};
