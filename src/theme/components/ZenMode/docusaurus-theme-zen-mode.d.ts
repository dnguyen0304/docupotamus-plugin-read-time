// TODO(dnguyen0304): Investigate referencing @docusaurus/module-type-aliases.
/// <reference types="@docusaurus/theme-classic" />

declare module '@docusaurus/theme-zen-mode' {
    interface ThemeConfig {
        readonly debug: {
            readonly zenModeIsEnabled: boolean;
        };
    }
}
