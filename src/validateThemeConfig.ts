import type {
    ThemeConfig,
    ThemeConfigValidationContext
} from '@docusaurus/types';
import { Joi } from '@docusaurus/utils-validation';
import type { DocupotamusThemeConfig } from './docusaurus-plugin-read-time';

const CONTENT_ROOT_SELECTOR: string =
    'main[class*="docMainContainer"] article div.markdown';

const DEFAULT_THEME_CONFIG: DocupotamusThemeConfig = {
    contentRootSelector: CONTENT_ROOT_SELECTOR,
    contentSelector: `${CONTENT_ROOT_SELECTOR} > *`,
    workbenchIsOpen: true,
    debug: {
        band: {
            isEnabled: false,
            // From B0 to B2, use decreasing alpha (opacity) because bands are
            // implemented as box shadows and therefore stack.
            // See: https://colorbox.io/?c0=%26p%24s%24%3D11%26p%24h%24st%24%3D351%26p%24h%24e%24%3D353%26p%24h%24c%24%3Deqo%26p%24sa%24st%24%3D0.08%26p%24sa%24e%24%3D0.94%26p%24sa%24r%24%3D1%26p%24sa%24c%24%3Deqo%26p%24b%24st%24%3D1%26p%24b%24e%24%3D0.04%26p%24b%24c%24%3Dl%26o%24n%24%3DNew+Color%26o%24ro%24%3Dcw%26o%24ms%24%3D0%2C1
            colors: [
                'hsla(352, 46%, 65%, 0.6)',  // B2
                'hsla(352, 48%, 42%, 0.6)',  // B1
                'hsla(353, 59%, 33%, 0.7)',  // B0
                'hsla(352, 48%, 42%, 0.6)',  // B1
                'hsla(352, 46%, 65%, 0.6)',  // B2
            ],
        },
        border: {
            isEnabled: false,
        },
    },
};

// TODO(dnguyen0304): Investigate missing labels.
// TODO(dnguyen0304): Fix incorrect ThemeConfig type.
export const ThemeConfigSchema = Joi.object<ThemeConfig>({
    docupotamusReadTimePlugin: Joi.object({
        contentRootSelector: Joi
            .string()
            .default(DEFAULT_THEME_CONFIG.contentRootSelector),
        contentSelector: Joi
            .string()
            .default(DEFAULT_THEME_CONFIG.contentSelector),
        workbenchIsOpen: Joi
            .boolean()
            .default(DEFAULT_THEME_CONFIG.workbenchIsOpen),
        debug: Joi.object({
            band: Joi.object({
                isEnabled: Joi
                    .boolean()
                    .default(DEFAULT_THEME_CONFIG.debug.band.isEnabled),
                colors: Joi
                    .array()
                    .items(Joi.string())
                    .length(5)
                    .default(DEFAULT_THEME_CONFIG.debug.band.colors)
                    .when(
                        'isEnabled',
                        {
                            is: Joi.boolean().valid(true),
                            // TODO(dnguyen0304): Improve error messaging.
                            then: Joi.forbidden(),
                        },
                    ),
            })
                .default(DEFAULT_THEME_CONFIG.debug.band),
            border: Joi.object({
                isEnabled: Joi
                    .boolean()
                    .default(DEFAULT_THEME_CONFIG.debug.border.isEnabled),
            })
                .default(DEFAULT_THEME_CONFIG.debug.border),
        })
            .default(DEFAULT_THEME_CONFIG.debug),
    })
        .label('themeConfig.docupotamusReadTimePlugin')
        .default(DEFAULT_THEME_CONFIG),
});

export function validateThemeConfig({
    validate,
    themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
    return validate(ThemeConfigSchema, themeConfig);
};
