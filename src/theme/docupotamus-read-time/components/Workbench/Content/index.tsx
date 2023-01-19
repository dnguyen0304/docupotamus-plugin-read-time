import type { PercentileRankStyle } from '@docusaurus/plugin-read-time';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { DividerProps } from '@mui/material/Divider';
import MuiDivider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { usePercentile } from '../../../../../contexts/percentile';
import Card from '../Card';
import { CARD_KEY_PREFIX } from '../constants';
import type { KeyedSample, Percentile } from '../types';

const PARTITION_KEY_PREFIX = 'contentPartition';
const LARGEST_PERCENTILE_RANK = 100;
const DIVIDER_SHOW = 0;

// TODO(dnguyen0304): Investigate if position is needed.
interface Partition {
    readonly label: string;
    readonly keyedSamples: readonly KeyedSample[];
};

// See: https://mui.com/material-ui/guides/composition/#with-typescript
const Divider = (
    props: DividerProps<'li', { component: 'li' }>,
): JSX.Element => {
    return <MuiDivider {...props} />
};

// TODO(dnguyen0304): Investigate migrating to use MUI List.
//   See: https://mui.com/material-ui/react-list/
const StyledOrderedList = styled('ol')({
    margin: 0,
    marginBottom: 'var(--space-2xs)',
    overflow: 'scroll',
    padding: 0,
});

const StyledDivider = styled(Divider)({
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 'var(--font-size--2)',
    margin: '0 var(--space-m)',
    '&::before, &::after': {
        borderColor: '#fff',
    },
});

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

const getDivider = (
    label: string,
    excludedLabel: string,
    partitionIndex: number,
    cardIsHidden: boolean,
): JSX.Element | null => {
    if (
        label === excludedLabel
        // Only include a top divider for the first card of the partition.
        || partitionIndex !== DIVIDER_SHOW
        || cardIsHidden
    ) {
        return null;
    }
    return (
        <StyledDivider
            key={`${PARTITION_KEY_PREFIX}-${label}`}
            component='li'
            textAlign='right'
        >
            {label}
        </StyledDivider>
    );
};

interface Props {
    readonly keyedSamples: readonly KeyedSample[];
    readonly targetIdToPrevRank: ReadonlyMap<string, number>;
    readonly showMinute: boolean;
    readonly hideUnread: boolean;
    readonly percentiles: readonly Percentile[];
};

export default function Content(
    {
        keyedSamples,
        targetIdToPrevRank,
        showMinute,
        hideUnread,
        percentiles,
    }: Props
): JSX.Element {
    const {
        percentile: {
            style: percentileRankStyle,
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
            .docupotamusReadTimePlugin;

    const { minRank, minScore } = usePercentile();

    const [partitions, setPartitions] = React.useState<Partition[]>([]);
    const [excludedLabel, setExcludedLabel] = React.useState<string>('');

    // TODO(dnguyen0304): Investigate unnecessary re-renders.
    const getListItems = (): (JSX.Element | null)[] => {
        let listItems: (JSX.Element | null)[] = [];
        for (const partition of partitions) {
            const {
                label,
                keyedSamples: partitionedSamples,
            } = partition;
            if (partitionedSamples.length === 0) {
                const divider = getDivider(
                    label,
                    excludedLabel,
                    DIVIDER_SHOW,
                    false,
                );
                listItems.push(divider);
                continue;
            }
            for (let i = 0; i < partitionedSamples.length; ++i) {
                const [targetId, sample, rankCurr] = partitionedSamples[i];
                const rankPrev = targetIdToPrevRank.get(targetId);
                const divider = getDivider(
                    label,
                    excludedLabel,
                    i,
                    sample.isHidden,
                );
                const card = (
                    <Card
                        key={`${CARD_KEY_PREFIX}-${targetId}`}
                        targetId={targetId}
                        details={sample.target.snippet}
                        rankCurr={rankCurr}
                        rankPrev={rankPrev}
                        readTimeSecond={sample.runningTotal.readTimeSecond}
                        showMinute={showMinute}
                        isHidden={sample.isHidden}
                    />
                );
                listItems.push(divider, card);
            }
        }
        return listItems;
    };

    React.useEffect(() => {
        const seen = new Set<string>();
        const newPartitions: Partition[] = percentiles.map((percentile) => {
            const { rank, scoreLower, scoreUpper } = percentile;
            let partitionedSamples: KeyedSample[] = [];
            // TODO(dnguyen0304): Fix unnecessary iteration passes.
            for (const current of keyedSamples) {
                const [targetId, sample] = current;
                const score = sample.runningTotal.readTimeSecond;
                const isInside = score > scoreLower && score <= scoreUpper;
                const isMin = rank === minRank && score === minScore;
                if (seen.has(targetId)) {
                    continue;
                }
                if (hideUnread && score === 0) {
                    continue;
                }
                if (!isInside && !isMin) {
                    continue;
                }
                partitionedSamples.push(current);
                seen.add(targetId);
            }
            return {
                label: formatPercentileRank(rank, percentileRankStyle),
                keyedSamples: partitionedSamples,
            };
        });
        setPartitions(newPartitions);
    }, [percentiles]);

    React.useEffect(() => {
        // Hide the divider for the 100th percentile because it creates a
        // separation between the header and content cards.
        setExcludedLabel(formatPercentileRank(
            LARGEST_PERCENTILE_RANK,
            percentileRankStyle,
        ));
    }, []);

    return (
        <StyledOrderedList>
            {getListItems()}
        </StyledOrderedList>
    );
};
