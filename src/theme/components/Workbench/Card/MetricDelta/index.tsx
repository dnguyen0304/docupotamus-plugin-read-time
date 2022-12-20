import { Keyframes } from '@emotion/serialize';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import * as React from 'react';
import { RUNNING_TOTALS_UPDATE_RATE_MILLI } from '../../../../../constants';
import { dayjs } from '../../../../../services';

// How long to wait after the refresh rate before clearing the metric.
const CLEAR_BUFFER_MILLI: number = 500;

function getAnimation(translateXPx: number): Keyframes {
    return keyframes({
        from: {
            opacity: 0,
            scale: '100%',
            translate: 0,
        },
        '99%': {
            opacity: 1,
            scale: '200%',
            translate: `${translateXPx}px -8px`,
        },
        to: {
            opacity: 0,
            scale: '200%',
            translate: `${translateXPx}px -8px`,
        },
    });
};

interface StyledBoxProps {
    readonly delta: number;
};

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'delta',
})<StyledBoxProps>(({ delta }) => {
    let leftOffsetPx: number = 0;
    let fontSize: string = 'inherit';
    let translateXPx: number = 0;

    if (delta < 2) {
        leftOffsetPx = 6;
        fontSize = 'var(--font-size--3)';
        translateXPx = 8;
    } else if (delta >= 2 && delta < 4) {
        leftOffsetPx = 8;
        fontSize = 'var(--font-size--2)';
        translateXPx = 6;
    } else if (delta >= 4) {
        leftOffsetPx = 10;
        fontSize = 'var(--font-size--1)';
        translateXPx = 2;
    }

    return {
        position: 'absolute',
        left: `calc(100% - ${leftOffsetPx}px)`,
        fontSize,
        marginTop: '6px',
        lineHeight: fontSize,
        animationDuration: '2s',
        animationFillMode: 'forwards',
        animationName: `${getAnimation(translateXPx)}`,
        animationTimingFunction: 'ease-in-out',
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

    // const [transform, setTransform] = React.useState<string>('');
    // const ref = React.useRef<HTMLDivElement>();

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

    React.useEffect(() => {
        // setTransform('scale(200%)')
        // setClassNames('');
        // void ref.current?.offsetWidth;
        // setTimeout(() => { }, 100);
        // setClassNames(styles.metricDelta_animation);
    }, []);

    const resetAnimation = () => {
        console.log('animation end');
    };

    return (
        <StyledBox
            delta={delta}
            onAnimationEnd={resetAnimation}
            sx={{
                display: delta ? 'block' : 'none',
            }}
        >
            {`+${delta}`}
        </StyledBox>
    );
};
