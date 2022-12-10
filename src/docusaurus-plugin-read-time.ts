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

export interface CardViewModel {
    readonly targetId: string;
    readonly details: string;
    readTime: {
        readonly minute: number;
        readonly second: number;
    };
}
