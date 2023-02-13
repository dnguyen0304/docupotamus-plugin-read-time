import type { PluginOptions } from '@docusaurus/plugin-read-time';
import type { LoadContext, Plugin } from '@docusaurus/types';

export default function pluginReadTime(
    _context: LoadContext,
    options: PluginOptions,
): Plugin<undefined> {
    const { swizzleIsEnabled = true } = options;

    return {
        name: 'docupotamus-plugin-read-time',

        getThemePath() {
            if (swizzleIsEnabled) {
                return '../lib/theme/swizzle';
            }
            return '../lib/theme/public';
        },

        getTypeScriptThemePath() {
            if (swizzleIsEnabled) {
                return '../src/theme/swizzle';
            }
            return '../src/theme/public';
        },
    };
};

export { validateThemeConfig } from './validateThemeConfig';

export const getSwizzleComponentList = (): string[] => [];
