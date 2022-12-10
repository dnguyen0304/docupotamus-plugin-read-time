import type { Plugin } from '@docusaurus/types';

// TODO(dnguyen0304): Fix missing LoadedContent type declaration.
export default function pluginReadTime(): Plugin<undefined> {
    return {
        name: 'docusaurus-plugin-read-time',

        getThemePath() {
            return './theme';
        },
    };
};

export { validateThemeConfig } from './validateThemeConfig';
