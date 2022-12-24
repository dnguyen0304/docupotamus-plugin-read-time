import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { CARD_KEY_PREFIX } from '../../constants';
import type { Sample as WorkbenchSample } from '../../types';
import Card from '../Card';
import styles from './styles.module.css';

// TODO(dnguyen0304): Add margin-bottom style.
const StyledBox = styled(Box)({
    position: 'relative',
});

type PositionIndex = 0 | 1 | 2;

const GOLD: PositionIndex = 0;
const SILVER: PositionIndex = 1;
const BRONZE: PositionIndex = 2;

const CURRENT_TO_CLICKED_TO_CLASS: ReadonlyMap<
    PositionIndex,
    ReadonlyMap<PositionIndex, string>
> = new Map([
    [GOLD, new Map([
        [SILVER, styles.card__notClickedLeft],
        [GOLD, styles.card__clicked],
        [BRONZE, styles.card__notClickedRight],
    ])],
    [SILVER, new Map([
        [BRONZE, styles.card__notClickedLeft],
        [SILVER, styles.card__clicked],
        [GOLD, styles.card__notClickedRight],
    ])],
    [BRONZE, new Map([
        [GOLD, styles.card__notClickedLeft],
        [BRONZE, styles.card__clicked],
        [SILVER, styles.card__notClickedRight],
    ])],
]);

const getClickedClass = (current: number, clicked: number): string => {
    // TODO(dnguyen0304): Fix missing PositionIndex type assertion.
    const className = CURRENT_TO_CLICKED_TO_CLASS.get(current)?.get(clicked);
    return className ? className : '';
}

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
                const clickedClass = getClickedClass(i, clickedIndex);
                const rankPrev = targetIdToPrevRank.get(targetId);
                return (
                    <Card
                        className={`${styles.card} ${clickedClass}`}
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
