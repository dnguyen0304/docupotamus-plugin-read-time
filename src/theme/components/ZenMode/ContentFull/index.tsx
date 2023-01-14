import Box from '@mui/material/Box';
import { styled, SxProps, Theme } from '@mui/material/styles';
import MDXContent from '@theme/MDXContent';
import * as React from 'react';
import styles from './styles.module.css';

const StyledBox = styled(Box)({
    // TODO(dnguyen0304): Fix missing responsive design.
    width: '40%',
    height: '100%',
    overflowY: 'auto',
    padding: '50vh 0',
});

interface Props {
    readonly children: React.ReactNode;
    readonly chunkIndex: number;
    readonly sx?: SxProps<Theme>;
};

export default function ContentFull(
    {
        children,
        chunkIndex,
        sx,
    }: Props,
): JSX.Element {
    const contentRef = React.useRef<HTMLDivElement>();
    const chunksRef = React.useRef<Element[]>([]);

    // TODO(dnguyen0304): Investigate extracting to useChildElementScroll hook
    //   to minimize duplicated code.
    React.useEffect(() => {
        const chunk = chunksRef.current[chunkIndex];
        if (!chunk) {
            return;
        }
        // TODO(dnguyen0304): Synchronize ContentFocus and ContentFull scrolling
        //   because scrollIntoView calls will interrupt one another when called
        //   "in parallel".
        // Use behavior: auto instead of behavior: smooth because the animation
        // is faster.
        window.setTimeout(() => {
            chunk.scrollIntoView({
                behavior: 'auto',
                block: 'center',
            });
        }, 1.5 * 1000)
    }, [chunkIndex]);

    // TODO(dnguyen0304): Investigate extracting to useChildElements hook.
    React.useEffect(() => {
        if (!contentRef.current) {
            // TODO(dnguyen0304): Add error handling.
            return;
        }
        chunksRef.current = [...contentRef.current.children];
    }, []);

    return (
        <StyledBox
            className={styles.scrollbar__hidden}
            ref={contentRef}
            sx={sx}
        >
            <MDXContent>{children}</MDXContent>
        </StyledBox>
    );
};
