import Box from '@mui/material/Box';
import * as React from 'react';
import Logo from './Logo';
import styles from './styles.module.css';

// TODO(dnguyen0304): Fix missing cohesion with styles.
const ANIMATION_DURATION_MILLI = 5 * 1000;

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
        <>
            <Logo
                fill='#fff'
                viewBox='100 700 1600 600'
            />
            <Box className={styles.loading_container}>
                <Box className={styles.loading_bar} />
            </Box>
        </>
    );
};
