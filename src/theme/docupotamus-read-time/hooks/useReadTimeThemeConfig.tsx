import type { ReadTimeThemeConfig } from '@docusaurus/plugin-read-time';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function useReadTimeThemeConfig(): ReadTimeThemeConfig {
    return (
        useDocusaurusContext()
            .siteConfig
            .themeConfig
            .docupotamusReadTimePlugin
    ) as ReadTimeThemeConfig;
};
