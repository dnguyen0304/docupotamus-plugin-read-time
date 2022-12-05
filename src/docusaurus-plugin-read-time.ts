export type DocupotamusThemeConfig = {
    contentRootSelector: string;
    contentSelector: string;
    debug: {
        band: {
            isEnabled: boolean;
            colors: string[];
        };
        border: {
            isEnabled: boolean;
        };
    };
};
