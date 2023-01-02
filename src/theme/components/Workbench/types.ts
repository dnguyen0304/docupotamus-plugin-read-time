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
