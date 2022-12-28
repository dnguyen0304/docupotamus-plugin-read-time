import Box from '@mui/material/Box';
import * as React from 'react';
import { CARD_KEY_PREFIX } from '../../constants';
import type { Sample as WorkbenchSample } from '../../types';
import Card from '../Card';
import styles from './styles.module.css';

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
    if (current > BRONZE
        || clicked > BRONZE
        || current < GOLD
        || clicked < GOLD
    ) {
        throw new Error(
            `position must be between ${GOLD} and ${BRONZE}, inclusive`
        );
    }
    const className =
        CURRENT_TO_CLICKED_TO_CLASS
            .get(current as PositionIndex)
            ?.get(clicked as PositionIndex);
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
    readonly clickedIndex: number;
    readonly setClickedIndex: React.Dispatch<React.SetStateAction<number>>;
};

export default function Cards(
    {
        keyedSamples,
        clickedIndex,
        setClickedIndex,
    }: Props
): JSX.Element {
    return (
        <Box sx={{ position: 'relative' }}>
            {keyedSamples.map((keyedSample, i) => {
                const [targetId, sample] = keyedSample;
                const clickedClass = getClickedClass(i, clickedIndex);
                return (
                    <Card
                        className={`${styles.card} ${clickedClass}`}
                        key={`${CARD_KEY_PREFIX}-${targetId}`}
                        targetId={targetId}
                        details={sample.target.snippet}
                        onClick={() => setClickedIndex(i)}
                        rankColor={getColor(i)}
                    />
                );
            })}
        </Box>
    );
};
