import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { CARD_KEY_PREFIX } from '../../constants';
import type { Sample as WorkbenchSample } from '../../types';
import Card from '../Card';
// import styles from './styles.module.css';

// TODO(dnguyen0304): Add margin-bottom style.
const StyledBox = styled(Box)({
    position: 'relative',
});

// TODO(dnguyen0304): Add real implementation for border-top color.
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

export default function Cards(
    {
        keyedSamples,
        targetIdToPrevRank,
        showMinute,
    }: Props
): JSX.Element {
    const [clickedIndex, setClickedIndex] = React.useState<number>(0);

    return (
        <StyledBox>
            {keyedSamples.map((keyedSample, i) => {
                const [targetId, sample, rankCurr] = keyedSample;
                const rankPrev = targetIdToPrevRank.get(targetId);
                return (
                    <Card
                        // className={`${clickedIndex} ${styles.header_card} ${getClickClass(i, clickedIndex)}`}
                        key={`${CARD_KEY_PREFIX}-${targetId}`}
                        targetId={targetId}
                        details={sample.target.snippet}
                        onClick={() => setClickedIndex(i)}
                        rankCurr={rankCurr}
                        rankPrev={rankPrev ? rankPrev : rankCurr}
                        rankColor={`var(--space-3xs) solid ${getColor(i)}`}
                        readTimeSecond={sample.runningTotal.readTimeSecond}
                        showMinute={showMinute}
                    />
                );
            })}
        </StyledBox>
    );
};
