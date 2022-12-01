import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { DocupotamusThemeConfig } from './docusaurus-plugin-read-time';

export function useDocupotamusThemeConfig(): DocupotamusThemeConfig {
    return (
        useDocusaurusContext()
            .siteConfig
            .themeConfig
            .docupotamus
    ) as DocupotamusThemeConfig;
}
