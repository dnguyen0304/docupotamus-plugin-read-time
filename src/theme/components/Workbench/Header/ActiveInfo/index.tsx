import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Metric from '../../Card/Metric';
import MetricDelta from '../../Card/MetricDelta';
import Rank from '../../Card/Rank';
import type { CardProps } from '../../types';

const StyledBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

interface Props extends Pick<
    CardProps,
    'rankCurr' | 'rankPrev' | 'readTimeSecond' | 'showMinute'
> { };

export default function ActiveInfo(
    {
        rankCurr,
        rankPrev,
        readTimeSecond,
        showMinute,
    }: Props
): JSX.Element {
    return (
        <StyledBox>
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
        </StyledBox>
    );
};
