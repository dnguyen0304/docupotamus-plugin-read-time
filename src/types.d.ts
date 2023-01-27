// TODO(dnguyen0304): Investigate why at least 1 import or export statement is
//   needed.

import type { DocupotamusThemeConfig } from '@docusaurus/plugin-read-time';

declare module '@docusaurus/types' {
    interface ThemeConfig {
        docupotamusReadTimePlugin: DocupotamusThemeConfig;
    }
}
