import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Card from '../Card';
import { CARD_KEY_PREFIX } from '../constants';
import type { Sample as WorkbenchSample } from '../types';

const StyledBox = styled(Box)({
    overflow: 'scroll',
    marginBottom: 'var(--space-2xs)',
});

// TODO(dnguyen0304): Investigate migrating to use MUI List.
//   See: https://mui.com/material-ui/react-list/
const StyledOrderedList = styled('ol')({
    margin: 0,
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

// See: https://stackoverflow.com/a/53577159
const getStandardDeviation = (values: ReadonlyArray<number>): number => {
    if (values.length === 0) {
        return 0;
    }
    const populationCount = values.length;
    const mean = values.reduce((a, b) => a + b) / populationCount;
    const sumOfSquares =
        values
            .map((value) => Math.pow(value - mean, 2))
            .reduce((a, b) => a + b);
    const variance = sumOfSquares / populationCount;
    return Math.sqrt(variance);
};

const partition = (
    {
        keyedSamples,
        targetIdToPrevRank,
        showMinute,
    }: Props
): JSX.Element => {
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

export default function Content(props: Props): JSX.Element {
    return (
        <StyledBox>
            {partition(props)}
        </StyledBox>
    );
};
