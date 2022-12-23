import type {
    RunningTotal,
    Target
} from '../../../docusaurus-plugin-read-time';

export interface Sample {
    readonly target: Target;
    readonly runningTotal: {
        readonly readTimeSecond: number;
    } & Omit<RunningTotal, 'visibleTimeMilli'>;
};

export interface CardProps {
    readonly className?: string;
    readonly targetId: string;
    readonly rankCurr: number;
    readonly rankPrev: number;
    readonly details: string;
    readonly readTimeSecond: number;
    readonly showMinute: boolean;
};
