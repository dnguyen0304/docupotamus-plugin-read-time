import { Keyframes } from '@emotion/serialize';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import * as React from 'react';
import { RUNNING_TOTALS_UPDATE_RATE_MILLI } from '../../../../../constants';
import { dayjs } from '../../../../../services';
import styles from './styles.module.css';

// Special value to hide the metric delta.
const HIDE: number = 0;
// How long to wait after the refresh rate before hiding the delta.
const HIDE_BUFFER_MILLI: number = 500;

type DeltaSize = 'sm' | 'md' | 'lg';

interface Config {
    readonly hasSparkleAnimation: boolean;
};

const CONFIG_DEFAULT: Config = {
    hasSparkleAnimation: false,
};

const SIZE_TO_CONFIG: Map<DeltaSize, Config> = new Map([
    [
        'sm',
        {
            hasSparkleAnimation: false,
        },
    ],
    [
        'md',
        {
            hasSparkleAnimation: false,
        },
    ],
    [
        'lg',
        {
            hasSparkleAnimation: true,
        },
    ],
]);

function getConfig(delta: number): Config {
    let config: Config | undefined;
    // TODO(dnguyen0304): Investigate refactoring to a switch.
    if (delta < 2) {
        config = SIZE_TO_CONFIG.get('sm');
    } else if (delta >= 2 && delta < 4) {
        config = SIZE_TO_CONFIG.get('md');
    } else if (delta >= 4) {
        config = SIZE_TO_CONFIG.get('lg');
    }
    if (!config) {
        return CONFIG_DEFAULT;
    }
    return config;
};

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
    let animationDurationSecond: number = 0.8;

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
        animationDurationSecond = 4;
    }

    return {
        position: 'absolute',
        left: `calc(100% - ${leftOffsetPx}px)`,
        // TODO(dnguyen0304): Extract to a centralized location to facilitate
        // maintenance.
        color: 'rgb(252, 201, 53)',
        fontSize,
        marginTop: '6px',
        lineHeight: fontSize,
        animationDuration: `${animationDurationSecond}s`,
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
    const ref = React.useRef<HTMLDivElement>();
    const readTimeSecondPrev = React.useRef<number>(0);
    const updatedAt = React.useRef<dayjs.Dayjs>();
    const updatedAtTimerId = React.useRef<number>();

    const resetAnimation = () => {
        if (ref.current) {
            setDelta(HIDE);
        }
    };

    React.useEffect(() => {
        const result = readTimeSecond - readTimeSecondPrev.current;
        if (result >= 0) {
            setDelta(result);
        } else {
            setDelta(HIDE);
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
                setDelta(HIDE);
            }
        }, RUNNING_TOTALS_UPDATE_RATE_MILLI + HIDE_BUFFER_MILLI);
        return () => window.clearTimeout(updatedAtTimerId.current);
    }, [readTimeSecond]);

    return (
        <StyledBox
            className={
                getConfig(delta).hasSparkleAnimation
                    ? `${styles.metricDelta_sparkle__animate}`
                    : ''
            }
            delta={delta}
            onAnimationEnd={resetAnimation}
            ref={ref}
            sx={{ display: delta ? 'block' : 'none' }}
        >
            {`+${delta}`}
        </StyledBox>
    );
};
