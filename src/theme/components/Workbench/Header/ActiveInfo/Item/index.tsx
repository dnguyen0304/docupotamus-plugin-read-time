import { styled } from '@mui/material/styles';
import * as React from 'react';
import Metric from '../../../Card/Metric';
import MetricDelta from '../../../Card/MetricDelta';
import Rank from '../../../Card/Rank';
import type { CardProps } from '../../../types';

const StyledListItem = styled('li')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
                sx={{
                    marginLeft: 0,
                    textAlign: 'center',
                }}
            />
            <MetricDelta readTimeSecond={readTimeSecond} />
        </StyledListItem>
    );
};
