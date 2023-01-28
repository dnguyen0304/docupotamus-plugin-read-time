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

type DeltaSize = 's' | 'm' | 'l';

interface Config {
    readonly leftOffsetPx: number;
    readonly fontSize: React.CSSProperties['fontSize'];
    readonly translateXPx: number;

    // Animations
    readonly fadeInDurationSecond: number;
    readonly sparkleIsEnabled: boolean;
};

const CONFIG_DEFAULT: Config = {
    leftOffsetPx: 0,
    fontSize: 'inherit',
    translateXPx: 0,
    fadeInDurationSecond: 0.8,
    sparkleIsEnabled: false,
};

// TODO(dnguyen0304): Investigate migrating from px to em units to scale with
// font-size.
const SIZE_TO_CONFIG: Map<DeltaSize, Config> = new Map([
    [
        's',
        {
            leftOffsetPx: 6,
            fontSize: 'var(--font-size--3)',
            translateXPx: 8,
            fadeInDurationSecond: 1,
            sparkleIsEnabled: false,
        },
    ],
    [
        'm',
        {
            leftOffsetPx: 8,
            fontSize: 'var(--font-size--2)',
            translateXPx: 6,
            fadeInDurationSecond: 1,
            sparkleIsEnabled: false,
        },
    ],
    [
        'l',
        {
            leftOffsetPx: 10,
            fontSize: 'var(--font-size--1)',
            translateXPx: 2,
            fadeInDurationSecond: 4,
            sparkleIsEnabled: true,
        },
    ],
]);

const getConfig = (delta: number): Config => {
    let config: Config | undefined;
    if (delta < 2) {
        config = SIZE_TO_CONFIG.get('s');
    } else if (delta >= 2 && delta < 4) {
        config = SIZE_TO_CONFIG.get('m');
    } else if (delta >= 4) {
        config = SIZE_TO_CONFIG.get('l');
    }
    if (!config) {
        return CONFIG_DEFAULT;
    }
    return config;
};

const getAnimation = (translateXPx: number): Keyframes => {
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
    readonly config: Config;
};

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'delta',
})<StyledBoxProps>(({ config }) => ({
    position: 'absolute',
    top: '6px',
    left: `calc(100% - ${config.leftOffsetPx}px)`,
    // TODO(dnguyen0304): Extract to a centralized location to facilitate
    // maintenance.
    color: 'rgb(252, 201, 53)',
    fontSize: config.fontSize,
    lineHeight: config.fontSize,
    animationDuration: `${config.fadeInDurationSecond}s`,
    animationFillMode: 'forwards',
    animationName: `${getAnimation(config.translateXPx)}`,
    animationTimingFunction: 'ease-in-out',
}));

interface Props {
    readonly readTimeSecond: number;
};

export default function Delta(
    {
        readTimeSecond,
    }: Props
): JSX.Element {
    const [delta, setDelta] = React.useState<number>(0);
    const ref = React.useRef<HTMLDivElement>();
    const readTimeSecondPrev = React.useRef<number>(readTimeSecond);
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
                getConfig(delta).sparkleIsEnabled
                    ? `${styles.metricDelta_sparkle__animate}`
                    : ''
            }
            config={getConfig(delta)}
            onAnimationEnd={resetAnimation}
            ref={ref}
            // Setting display: none causes a re-render but not an unmount.
            sx={{ display: delta ? 'block' : 'none' }}
        >
            {`+${delta}`}
        </StyledBox>
    );
};
