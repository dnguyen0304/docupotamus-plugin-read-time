// TODO(dnguyen0304): Investigate referencing @docusaurus/module-type-aliases.
/// <reference types="@docusaurus/theme-classic" />

import type { Props as DocPageLayoutMainProps } from '@theme/DocPage/Layout/Main';
import type { Props as LayoutProviderProps } from '@theme/Layout/Provider';

declare module '@docusaurus/types' {
    interface ThemeConfig {
        docupotamusReadTimePlugin: DocupotamusThemeConfig;
    }
}

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: false;
        sm: false;
        md: false;
        lg: false;
        xl: false;
        mobile: true;
    }
}

declare module '@theme-init/DocPage/Layout/Main' {
    interface DocPageLayoutMain {
        (props: DocPageLayoutMainProps): JSX.Element;
    }
}

declare module '@theme-init/Layout/Provider' {
    interface LayoutProvider {
        (props: LayoutProviderProps): JSX.Element;
    }
}

export interface DocupotamusThemeConfig {
    readonly contentRootSelector: string;
    readonly contentSelector: string;
    readonly workbenchIsOpen: boolean;
    debug: {
        band: {
            readonly isEnabled: boolean;
            readonly colors: string[];
        };
        border: {
            readonly isEnabled: boolean;
        };
    };
}

// Contiguous region of content.
export interface Target {
    // Target unique identifier.
    readonly id: string;

    // TODO(dnguyen0304): Add repository information.
    // Page containing the target.
    readonly source: Source;

    // Root to reference for relative selector paths.
    readonly selectorRoot: RangeSelector;

    // Serialized queries for locating a target on a page.
    readonly selectors: Selector[];
}

export interface Source {
    readonly href: string;
}

// Locates a region of content using XPaths and character offsets.
export interface RangeSelector {
    readonly type: 'RangeSelector';
    readonly startContainer: string;
    readonly startOffset: number;
    readonly endContainer: string;
    readonly endOffset: number;
}

// Serialized queries for locating a target on a page.
export type Selector = RangeSelector;

export type BandFriendlyKey =
    | 'B2-top'
    | 'B1-top'
    | 'B0'
    | 'B1-bottom'
    | 'B2-bottom';

export interface Band {
    // Unique identifier that is human-readable.
    readonly friendlyKey: BandFriendlyKey;

    // Top position as a percent of the viewport height. This range endpoint is
    // inclusive: [top, bottom).
    readonly topVh: number;

    // Bottom position as a percent of the viewport height. This range endpoint
    // is exclusive: [top, bottom).
    readonly bottomVh: number;

    // Currently unused.
    readonly multiplier: number;
}

export interface StartIntersectionSample {
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

export type StopIntersectionSample = Pick<
    StartIntersectionSample,
    | 'timestampMilli'
    | 'target'
    | 'band'
    | 'isIntersecting'
>;

export type IntersectionSample =
    StartIntersectionSample | StopIntersectionSample;

export interface DeviceInfo {
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

interface RunningTotalSample {
    readonly target: Target;
    readonly runningTotal: RunningTotal;
}

export interface CardViewModel {
    readonly targetId: string;
    readonly details: string;
    readTime: {
        readonly minute: number;
        readonly second: number;
    };
}
