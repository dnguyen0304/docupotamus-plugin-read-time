import type { Plugin } from '@docusaurus/types';

export default function pluginReadTime(): Plugin<undefined> {
    return {
        name: 'docusaurus-plugin-read-time',

        getThemePath() {
            return './theme';
        },
    };
}

export { validateThemeConfig } from './validateThemeConfig';
