import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { RUNNING_TOTALS_UPDATE_RATE_MILLI } from '../../../../../constants';
import { dayjs } from '../../../../../services';

// How long to wait after the refresh rate before clearing the metric.
const CLEAR_BUFFER_MILLI: number = 500;

interface StyledBoxProps {
    readonly delta: number;
    // TODO(dnguyen0304): Remove from props because it can be passed unread.
    // TODO(dnguyen0304): Fix not strict typing.
    readonly display: string;
};

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'delta' && prop !== 'display',
})<StyledBoxProps>(({ delta, display }) => {
    let fontSize: string = 'inherit';
    if (delta < 2) {
        fontSize = 'var(--font-size--3)';
    } else if (delta >= 2 && delta < 4) {
        fontSize = 'var(--font-size--2)';
    } else if (delta >= 4) {
        fontSize = 'var(--font-size--1)';
    }
    return {
        display,
        position: 'absolute',
        left: '100%',
        fontSize,
        lineHeight: fontSize,
    };
});

interface Props {
    readonly readTimeSecond: number;
};

export default function MetricDelta(
    {
        readTimeSecond,
    }: Props
): JSX.Element {
    const [delta, setDelta] = React.useState<number>(0);
    const readTimeSecondPrev = React.useRef<number>(0);
    const updatedAt = React.useRef<dayjs.Dayjs>();
    const updatedAtTimerId = React.useRef<number>();

    React.useEffect(() => {
        const result = readTimeSecond - readTimeSecondPrev.current;
        if (result >= 0) {
            setDelta(result);
        } else {
            setDelta(0);
            // TODO(dnguyen0304): Investigate changing to throwing an error.
            console.log(
                `NegativeMetricDeltaError: current read time ${readTimeSecond} `
                + `is less than previous read time `
                + `${readTimeSecondPrev.current}`
            );
        }
        readTimeSecondPrev.current = readTimeSecond;

        // TODO(dnguyen0304): Investigate if @docusaurus/ExecutionEnvironment is
        // needed.
        window.clearTimeout(updatedAtTimerId.current);
        updatedAt.current = dayjs.utc();
        updatedAtTimerId.current = window.setTimeout(() => {
            // TODO(dnguyen0304): Investigate if checking staleness is needed.
            const staleness =
                dayjs
                    .utc()
                    .diff(updatedAtTimerId.current, 'millisecond');
            if (staleness > RUNNING_TOTALS_UPDATE_RATE_MILLI) {
                setDelta(0);
            }
        }, RUNNING_TOTALS_UPDATE_RATE_MILLI + CLEAR_BUFFER_MILLI);
        return () => window.clearTimeout(updatedAtTimerId.current);
    }, [readTimeSecond]);

    return (
        <StyledBox
            delta={delta}
            display={delta ? 'block' : 'none'}
        >
            {`+${delta}`}
        </StyledBox>
    );
};
