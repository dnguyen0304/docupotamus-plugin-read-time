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
    readonly sx?: SxProps<Theme>;
};

export default function ContentFull(
    {
        children,
        sx,
    }: Props,
): JSX.Element {
    const contentRef = React.useRef<HTMLDivElement>();
    const chunksRef = React.useRef<Element[]>([]);

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
