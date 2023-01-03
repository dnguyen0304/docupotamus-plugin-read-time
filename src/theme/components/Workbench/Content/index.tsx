import type { PercentileRankStyle } from '@docusaurus/plugin-read-time';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Card from '../Card';
import { CARD_KEY_PREFIX } from '../constants';
import type { KeyedSample, Percentile } from '../types';

const PARTITION_KEY_PREFIX = 'contentPartition';
const LARGEST_PERCENTILE_RANK = 100;

// TODO(dnguyen0304): Investigate if position is needed.
interface Partition {
    readonly label: string;
    readonly keyedSamples: readonly KeyedSample[];
}

const StyledBox = styled(Box)({
    overflow: 'scroll',
    marginBottom: 'var(--space-2xs)',
});

const StyledDivider = styled(Divider)({
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 'var(--font-size--2)',
    margin: '0 var(--space-xs)',
    '&::before, &::after': {
        borderColor: '#fff',
    },
});

// TODO(dnguyen0304): Investigate migrating to use MUI List.
//   See: https://mui.com/material-ui/react-list/
const StyledOrderedList = styled('ol')({
    margin: 0,
    padding: 0,
});

interface Props {
    readonly keyedSamples: readonly KeyedSample[];
    readonly targetIdToPrevRank: ReadonlyMap<string, number>;
    readonly showMinute: boolean;
    readonly percentiles: readonly Percentile[];
};

const formatPercentileRank = (
    rank: number,
    style: PercentileRankStyle,
): string => {
    if (style === 'p') {
        return `p${rank}`;
    }
    if (style === 'th') {
        return `${rank}th`;
    }
    if (style === 'full-lower') {
        return `${rank}th percentile`;
    }
    if (style === 'full-upper') {
        return `${rank}th Percentile`;
    }
    return '';
};

const partition = (
    {
        keyedSamples,
        targetIdToPrevRank,
        showMinute,
        percentiles,
    }: Props
): JSX.Element => {
    const { percentileRankStyle } =
        useDocusaurusContext()
            .siteConfig
            .themeConfig
            .docupotamusReadTimePlugin;

    const partitions: Partition[] = percentiles.map((percentile) => {
        const { rank, scoreLower, scoreUpper } = percentile;
        let partitionedSamples: KeyedSample[] = [];
        // TODO(dnguyen0304): Fix unnecessary iteration passes (for example, by
        //   using the Array.values iterator).
        for (const current of keyedSamples) {
            const readTimeSecond = current[1].runningTotal.readTimeSecond;
            // if (readTimeSecond === 0 && scoreLower === 0) {
            //     partitionedSamples.push(current);
            // }
            if (readTimeSecond > scoreLower && readTimeSecond <= scoreUpper) {
                partitionedSamples.push(current);
            }
        }
        return {
            label: formatPercentileRank(rank, percentileRankStyle),
            keyedSamples: partitionedSamples,
        };
    });

    // Hide the divider for the 100th percentile because it creates a separation
    // between the header and content cards.
    const excludedLabel = formatPercentileRank(
        LARGEST_PERCENTILE_RANK,
        percentileRankStyle,
    );

    return (
        <>
            {partitions.map((partition) => {
                const {
                    label,
                    keyedSamples: partitionedSamples,
                } = partition;
                return (
                    <Box key={`${PARTITION_KEY_PREFIX}-${label}`}>
                        {
                            (label !== excludedLabel)
                                ? (
                                    <StyledDivider textAlign='right'>
                                        {label}
                                    </StyledDivider>
                                )
                                : null
                        }
                        <StyledOrderedList>
                            {partitionedSamples.map((keyedSample) => {
                                const [
                                    targetId,
                                    sample,
                                    rankCurr,
                                ] = keyedSample;
                                const rankPrev =
                                    targetIdToPrevRank.get(targetId);
                                return (
                                    <Card
                                        key={`${CARD_KEY_PREFIX}-${targetId}`}
                                        targetId={targetId}
                                        details={sample.target.snippet}
                                        rankCurr={rankCurr}
                                        rankPrev={rankPrev}
                                        readTimeSecond={
                                            sample.runningTotal.readTimeSecond
                                        }
                                        showMinute={showMinute}
                                    />
                                );
                            })}
                        </StyledOrderedList>
                    </Box>
                );
            })}
        </ >
    );
};

export default function Content(props: Props): JSX.Element {
    return (
        <StyledBox>
            {partition(props)}
        </StyledBox>
    );
};
