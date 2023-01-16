import type { ThemeConfig } from '@docusaurus/theme-zen-mode';
import { Joi } from '@docusaurus/utils-validation';

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
    debug: {
        zenModeIsEnabled: false,
    },
};

// TODO(dnguyen0304): Investigate missing labels.
export const ThemeConfigSchema = Joi.object<ThemeConfig>({
    debug: Joi.object({
        zenModeIsEnabled: Joi
            .boolean()
            .default(DEFAULT_THEME_CONFIG.debug.zenModeIsEnabled),
    })
        .default(DEFAULT_THEME_CONFIG.debug),
});
