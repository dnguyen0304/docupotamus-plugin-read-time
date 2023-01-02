import type { RunningTotal, Target } from '@docusaurus/plugin-read-time';

export interface Sample {
    readonly target: Target;
    readonly runningTotal: {
        readonly readTimeSecond: number;
    } & Omit<RunningTotal, 'visibleTimeMilli'>;
};

export interface CardProps {
    // TODO(dnguyen0304): Investigate extracting to CommonProps similar to @mui.
    readonly className?: string;
    readonly targetId: string;
    readonly details: string;
    readonly rankCurr: number;
    readonly rankPrev: number | undefined;
    readonly readTimeSecond: number;
    readonly showMinute: boolean;
};

export interface Percentile {
    // Human-readable description.
    readonly label: string;

    // Upper bound. This range endpoint is exclusive: [lower, upper).
    readonly boundUpper: number;
}
