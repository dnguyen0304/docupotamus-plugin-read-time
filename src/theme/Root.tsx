import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { SamplesProvider } from '../contexts/samples';
import '../styles.css';
import App from '../theme/components/App';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: false;
        sm: false;
        md: false;
        lg: false;
        xl: false;
        mobile: true;
    }
}

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

export default function Root({ children }: Props): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            <SamplesProvider>
                <App />
                {children}
            </SamplesProvider>
        </ThemeProvider>
    );
};
