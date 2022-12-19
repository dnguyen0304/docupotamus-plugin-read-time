import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { RUNNING_TOTALS_UPDATE_RATE_MILLI } from '../../../../../constants';
import { dayjs } from '../../../../../services';

const SECOND_TO_MINUTE: number = 60;
// How long to wait after the refresh rate before clearing the metric.
const CLEAR_BUFFER_MILLI: number = 500;

interface StyledBoxProps {
    readonly delta: number;
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
        position: 'relative',
        marginLeft: 'auto',
        '&:after': {
            content: `"+${delta}"`,
            display,
            position: 'absolute',
            bottom: 0,
            left: '100%',
            fontSize,
            lineHeight: fontSize,
            marginLeft: '2px',
        },
    };
});

interface Props {
    readonly readTimeSecond: number;
    readonly showMinute: boolean;
};

// TODO(dnguyen0304): Add tooltip for rank change.
export default function Metric(
    {
        readTimeSecond,
        showMinute,
    }: Props
): JSX.Element {
    const [delta, setDelta] = React.useState<number>(0);
    const readTimeSecondPrev = React.useRef<number>(0);
    const updatedAt = React.useRef<dayjs.Dayjs>();
    const updatedAtTimerId = React.useRef<number>();

    const format = (totalSeconds: number, showMinute: boolean): string => {
        if (showMinute) {
            const minute = Math.floor(totalSeconds / SECOND_TO_MINUTE);
            const second = Math.round(totalSeconds % SECOND_TO_MINUTE);
            return `${minute}m:${second}s`;
        }
        return `${totalSeconds}s`;
    };

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
            component='span'
            delta={delta}
            display={delta ? 'block' : 'none'}
        >
            {format(readTimeSecond, showMinute)}
        </StyledBox>
    );
};
