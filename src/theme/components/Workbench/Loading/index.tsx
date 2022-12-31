import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Logo from './Logo';
import styles from './styles.module.css';

// TODO(dnguyen0304): Fix missing cohesion with styles.
const ANIMATION_DURATION_MILLI = 5 * 1000;

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
    const timerId = React.useRef<number>();

    React.useEffect(() => {
        timerId.current = window.setTimeout(() => {
            setIsLoading(false);
        }, ANIMATION_DURATION_MILLI);
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
