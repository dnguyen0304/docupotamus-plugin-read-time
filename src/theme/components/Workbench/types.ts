import type { RunningTotal, Target } from '@docusaurus/plugin-read-time';

export interface Sample {
    readonly target: Target;
    readonly runningTotal: {
        readonly readTimeSecond: number;
    } & Omit<RunningTotal, 'visibleTimeMilli'>;
    // TODO(dnguyen0304): Investigate changing to readonly.
    isHidden: boolean;
};

// TODO(dnguyen0304): Investigate changing to an object for self-documentation.
export type KeyedSample = readonly [
    string,  // targetId
    Sample,
    number,  // rankCurr
];

export interface CardProps {
    // TODO(dnguyen0304): Investigate extracting to CommonProps similar to @mui.
    readonly className?: string;
    readonly targetId: string;
    readonly details: string;
    readonly percentileDivider: JSX.Element | null;
    readonly rankCurr: number;
    readonly rankPrev: number | undefined;
    readonly readTimeSecond: number;
    readonly showMinute: boolean;
    readonly isHidden: boolean;
};

export interface Percentile {
    // Human-readable description. This always references the upper bound. In
    // other words:
    //
    //   [0, 1, 2, 3, 100, 999, 999, 999, 999]
    //
    //   {
    //       rank: 50,
    //       scoreUpper: 100,
    //   }
    //
    // is interpreted as "50% of scores fall below a value of 100".
    readonly rank: number;

    // Lower bound. This range endpoint is exclusive: (lower, upper].
    readonly scoreLower: number;

    // Upper bound. This range endpoint is inclusive: (lower, upper].
    readonly scoreUpper: number;
};
