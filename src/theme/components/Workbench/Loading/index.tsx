import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import type {
    DocupotamusThemeConfig
} from '../../../../docusaurus-plugin-read-time';
import Logo from './Logo';
import styles from './styles.module.css';

const Layout = styled(Box)({
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    rowGap: 'var(--space-l)',
});

interface Props {
    readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Loading(
    {
        setIsLoading,
    }: Props
): JSX.Element {
    const {
        debug: {
            loading: {
                durationMilli,
            },
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
        .docupotamusReadTimePlugin as DocupotamusThemeConfig;

    const timerId = React.useRef<number>();

    React.useEffect(() => {
        timerId.current = window.setTimeout(() => {
            setIsLoading(false);
        }, durationMilli);
        return () => window.clearTimeout(timerId.current);
    }, []);

    return (
        <Layout>
            <Logo
                fill='#fff'
                viewBox='100 700 1600 600'
                width='80%'
            />
            <Box className={styles.loading_container}>
                <Box className={styles.loading_bar} />
            </Box>
        </Layout>
    );
};
