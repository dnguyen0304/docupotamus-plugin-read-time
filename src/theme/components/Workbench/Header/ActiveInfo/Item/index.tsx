import { styled } from '@mui/material/styles';
import * as React from 'react';
import Metric from '../../../Card/Metric';
import MetricDelta from '../../../Card/MetricDelta';
import Rank from '../../../Card/Rank';
import type { CardProps } from '../../../types';

const StyledListItem = styled('li')({
    width: 'fit-content',
    minWidth: '40%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 auto',
});

interface Props extends Pick<
    CardProps,
    'rankCurr' | 'rankPrev' | 'readTimeSecond' | 'showMinute'
> { };

export default function Item(
    {
        rankCurr,
        rankPrev,
        readTimeSecond,
        showMinute,
    }: Props
): JSX.Element {
    return (
        <StyledListItem>
            <Rank
                curr={rankCurr}
                prev={rankPrev}
                arrowPosition='left'
            />
            <Metric
                readTimeSecond={readTimeSecond}
                showMinute={showMinute}
                marginLeftFactor={2}
                minWidthFactor={1.5}
                sx={{ textAlign: 'center' }}
            />
            <MetricDelta readTimeSecond={readTimeSecond} />
        </StyledListItem>
    );
};
