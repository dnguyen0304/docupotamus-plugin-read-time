export type Band = {
    // Unique identifier that is human-readable.
    readonly friendlyKey: string;

    // Top position as a percent of the viewport height. This range endpoint is
    // inclusive: [top, bottom).
    readonly topVh: number;

    // Bottom position as a percent of the viewport height. This range endpoint
    // is exclusive: [top, bottom).
    readonly bottomVh: number;

    // Currently unused.
    readonly multiplier: number;
};

export type IntersectionSample = {
    // Measurement time as a Unix epoch timestamp, in milliseconds.
    readonly timestampMilli: number;

    // Smallest rectangle that contains the target.
    readonly targetRect: DOMRect;

    // Intersection root.
    readonly band: Band;

    // Whether the target is intersecting, at any threshold, with the band.
    readonly isIntersecting: boolean;

    // Viewport height, in pixels.
    readonly viewportHeightPx: number;
};