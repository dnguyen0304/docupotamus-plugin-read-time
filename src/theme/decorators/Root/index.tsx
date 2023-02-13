import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import App from '../../package/components/App';
import { SamplesProvider } from '../../package/contexts/samples';
import '../../package/styles.css';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: false;
        sm: false;
        md: false;
        lg: false;
        xl: false;
        mobile: true;
    }
};

// TODO(dnguyen0304): Fix unused primary color for Root theme component.
const COLOR_ACCENT_GREEN: React.CSSProperties['color'] = '#64ffda';

const theme = createTheme({
    breakpoints: {
        values: {
            // See: https://docusaurus.io/docs/styling-layout#mobile-view
            mobile: 996,
        },
    },
    palette: {
        // TODO(dnguyen0304): Add rgb(48, 56, 70).
        grey: {
            400: 'rgb(137, 150, 165)',  // #8996a5
            600: 'rgb(46, 69, 97)',     // #2e4561  GRADIENT_STOP_TOP      blueish
            700: 'rgb(39, 60, 85)',     // #273c55  GRADIENT_STOP_BOTTOM   blueish
            800: 'rgb(54, 55, 50)',     // #363732
        },
    },
});

interface Props {
    readonly children: React.ReactNode;
};

export default function RootDecorator({ children }: Props): JSX.Element {
    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <SamplesProvider>
                    {children}
                    <App />
                </SamplesProvider>
            </ThemeProvider>
        </React.StrictMode>
    );
};
