import Box from '@mui/material/Box';
import { styled, SxProps, Theme } from '@mui/material/styles';
import MDXContent from '@theme/MDXContent';
import * as React from 'react';
import styles from './styles.module.css';

const StyledBox = styled(Box)(({ theme }) => ({
    // TODO(dnguyen0304): Fix missing responsive design.
    width: '60%',
    // TODO(dnguyen0304): Investigate why using a percentage does not work.
    height: '60vh',
    display: 'grid',
    placeItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1rem',
    boxShadow: `
        5px 5px 10px 0 rgb(0 0 0 / 5%),
        10px 10px 20px 0 rgb(0 0 0 / 5%),
        20px 20px 40px 0 rgb(0 0 0 / 5%),
        40px 40px 80px 0 rgb(0 0 0 / 5%)`,
}));

interface Props {
    readonly children: React.ReactNode;
    readonly sx?: SxProps<Theme>;
};

export default function ContentFocus(
    {
        children,
        sx,
    }: Props,
): JSX.Element {
    const chunksRef = React.useRef<Element[]>([]);

    // See: https://stackoverflow.com/a/60066291
    const handleRefChange = React.useCallback<(node: HTMLDivElement) => void>(
        node => {
            if (node === null) {
                return;
            }
            if (chunksRef.current.length !== 0) {
                return;
            }
            chunksRef.current = [...node.children];
            const chunks = chunksRef.current;
            for (let i = 0; i < chunks.length; ++i) {
                chunks[i].classList.toggle(styles.chunk);
                // if (i === activeChunkIndex) {
                //     chunks[i].classList.toggle(styles.chunk__active);
                // } else {
                //     chunks[i].classList.toggle(styles.chunk__notActive);
                // }
            }
        },
        // [activeChunkIndex],
        [],
    );

    return (
        <StyledBox sx={sx}>
            <Box
                className={
                    `${styles.clippingBox} ${styles.scrollbar__hidden}`
                }
                ref={handleRefChange}
            >
                <MDXContent>{children}</MDXContent>
            </Box>
        </StyledBox>
    );
};
