/// <reference types="@docusaurus/theme-classic" />

declare module '@docusaurus/plugin-read-time' {
    interface ReadTimeThemeConfig {
        readonly contentRootSelector: string;
        readonly contentSelector: string;
        readonly tabs: readonly TabConfig[];
        readonly activeTabId: string;
        readonly percentile: {
            readonly ranks: readonly number[];
            readonly style: PercentileRankStyle;
        };
        readonly swizzleIsEnabled: boolean;
        readonly debug: {
            readonly band: {
                readonly isEnabled: boolean;
                readonly colors: readonly string[];
            };
            readonly border: {
                readonly isEnabled: boolean;
            };
            readonly loading: {
                readonly isEnabled: boolean;
                readonly durationMilli: number;
            };
        };
    }

    interface TabConfig {
        readonly tabId: string;
        readonly modulePath: string;
        readonly iconModulePath: string;
    }

    type DocupotamusThemeConfig = ReadTimeThemeConfig;

    // Contiguous region of content.
    interface Target {
        // Target unique identifier.
        readonly id: string;

        // TODO(dnguyen0304): Add repository information.
        // Page containing the target.
        readonly source: Source;

        // Root to reference for relative selector paths.
        readonly selectorRoot: RangeSelector;

        // TODO(dnguyen0304): Investigate if ReadonlyArray is needed.
        // Serialized queries for locating a target on a page.
        readonly selectors: Selector[];

        // Short excerpt of text.
        readonly snippet: string;
    }

    interface Source {
        readonly href: string;
    }

    // Locates a region of content using XPaths and character offsets.
    interface RangeSelector {
        readonly type: 'RangeSelector';
        readonly startContainer: string;
        readonly startOffset: number;
        readonly endContainer: string;
        readonly endOffset: number;
    }

    // Serialized queries for locating a target on a page.
    interface Selector extends RangeSelector { }

    type BandFriendlyKey =
        | 'B2-top'
        | 'B1-top'
        | 'B0'
        | 'B1-bottom'
        | 'B2-bottom';

    interface Band {
        // Unique identifier that is human-readable.
        readonly friendlyKey: BandFriendlyKey;

        // Top position as a percent of the viewport height. This range endpoint
        // is inclusive: [top, bottom).
        readonly topVh: number;

        // Bottom position as a percent of the viewport height. This range
        // endpoint is exclusive: [top, bottom).
        readonly bottomVh: number;

        // Currently unused.
        readonly multiplier: number;
    }

    interface StartIntersectionSample {
        // Measurement time as a Unix epoch timestamp, in milliseconds.
        readonly timestampMilli: number;

        // Contiguous region of content.
        readonly target: Target;

        // Horizontal region ("slice") of the viewport.
        readonly band: Band;

        // Whether the target is intersecting, at any threshold, with the band.
        readonly isIntersecting: boolean;

        // Smallest rectangle that contains the target.
        readonly targetRect: DOMRect;

        // Details about the device being used to view the target.
        readonly deviceInfo: DeviceInfo;
    }

    interface StopIntersectionSample extends Pick<
        StartIntersectionSample,
        | 'timestampMilli'
        | 'target'
        | 'band'
        | 'isIntersecting'
    > { }

    type IntersectionSample =
        StartIntersectionSample | StopIntersectionSample;

    interface DeviceInfo {
        // Viewport height, in pixels.
        readonly viewportHeightPx: number;
    }

    interface RunningTotal {
        // Total visible time, in milliseconds.
        visibleTimeMilli: number;

        // TODO(dnguyen0304): Implement RunningTotal.lastSample.
        // Last sample included in the calculation.
        lastSample: IntersectionSample | null;
    }

    // TODO(dnguyen0304): Investigate adding a "top X%" style.
    type PercentileRankStyle =
        // For example, "p95".
        | 'p'
        // For example, "95th".
        | 'th'
        // For example, "95th percentile".
        | 'full-lower'
        // For example, "95th Percentile".
        | 'full-upper';
}
