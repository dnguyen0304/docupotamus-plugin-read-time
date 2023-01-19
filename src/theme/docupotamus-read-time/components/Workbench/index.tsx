import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useToolbar } from '../../../../contexts/toolbar';
import Loading from './Loading';
import styles from './styles.module.css';

interface StyledBoxProps {
    readonly workbenchIsOpen: boolean;
    readonly boxShadowWidth: React.CSSProperties['width'];
};

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'workbenchIsOpen' && prop !== 'boxShadowWidth',
})<StyledBoxProps>(({ theme, workbenchIsOpen, boxShadowWidth }) => ({
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: workbenchIsOpen ? 'flex' : 'none',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    background: `linear-gradient(
        to right,
        ${theme.palette.grey[600]} 0%,
        ${theme.palette.grey[700]} 80%)`,
    borderTopLeftRadius: 'var(--space-l-xl)',
    paddingBottom: 'var(--space-xs)',
    // TODO(dnguyen0304): Investigate refactoring to box-shadow style to reduce
    // complexity.
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: `calc(-1 * ${boxShadowWidth})`,
        width: boxShadowWidth,
        height: '100vh',
        background: `linear-gradient(
            to right,
            transparent,
            rgba(60, 64, 67, 0.15) 70%,
            rgba(60, 64, 67, 0.4) 100%)`,
    },
}));

export default function Workbench(): JSX.Element {
    const {
        debug: {
            loading: {
                isEnabled: loadingIsEnabled,
            },
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
            .docupotamusReadTimePlugin;

    const location = useLocation();
    const { workbenchIsOpen, tabIdToComponent, activeTabId } = useToolbar();

    const [isLoading, setIsLoading] = React.useState<boolean>(loadingIsEnabled);

    // TODO(dnguyen0304): Add error handling.
    const Tab = tabIdToComponent.get(activeTabId)!;

    React.useEffect(() => {
        if (!loadingIsEnabled) {
            return;
        }
        setIsLoading(true);
    }, [location]);

    return (
        <StyledBox
            className={isLoading ? styles.workbench_container__load : ''}
            workbenchIsOpen={workbenchIsOpen}
            boxShadowWidth='var(--space-xs)'
        >
            {/* TODO(dnguyen0304): Replace temporary placeholder stub. */}
            <React.Suspense fallback={<p>Loading...</p>}>
                {
                    // TODO(dnguyen0304): Fix loading not triggering on open.
                    isLoading
                        ? <Loading setIsLoading={setIsLoading} />
                        : <Tab />
                }
            </React.Suspense>
        </StyledBox >
    );
};
