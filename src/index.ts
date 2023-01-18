import type { Plugin } from '@docusaurus/types';

// TODO(dnguyen0304): Fix missing LoadedContent type declaration.
export default function pluginReadTime(): Plugin<undefined> {
    return {
        name: 'docusaurus-plugin-read-time',

        getThemePath() {
            return '../lib/theme';
        },

        getTypeScriptThemePath() {
            return '../src/theme';
        },
    };
};

export { validateThemeConfig } from './validateThemeConfig';

export const getSwizzleComponentList = (): string[] => [];
