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
    readonly chunkIndex: number;
    readonly sx?: SxProps<Theme>;
};

export default function ContentFocus(
    {
        children,
        chunkIndex,
        sx,
    }: Props,
): JSX.Element {
    const [, setChunkIndex] = React.useState<number>(0);

    const clippingBoxRef = React.useRef<HTMLDivElement>();
    const chunksRef = React.useRef<Element[]>([]);

    const getActiveChunkIndex = () => {
        if (!clippingBoxRef.current) {
            return;
        }
        const newChunkIndex = Math.round(
            clippingBoxRef.current.scrollTop
            / clippingBoxRef.current.getBoundingClientRect().height
        );
        setChunkIndex(newChunkIndex);
    };

    // TODO(dnguyen0304): Investigate extracting to useChildElementScroll hook
    //   to minimize duplicated code.
    React.useEffect(() => {
        const chunk = chunksRef.current[chunkIndex];
        if (!chunk) {
            return;
        }
        chunk.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }, [chunkIndex]);

    // TODO(dnguyen0304): Investigate extracting to useChildElements hook.
    React.useEffect(() => {
        if (!clippingBoxRef.current) {
            // TODO(dnguyen0304): Add error handling.
            return;
        }
        chunksRef.current = [...clippingBoxRef.current.children];
        const chunks = chunksRef.current;
        for (let i = 0; i < chunks.length; ++i) {
            chunks[i].classList.toggle(styles.chunk);
            // if (i === activeChunkIndex) {
            //     chunks[i].classList.toggle(styles.chunk__active);
            // } else {
            //     chunks[i].classList.toggle(styles.chunk__notActive);
            // }
        }
    }, []);

    return (
        <StyledBox
            onClick={(event) => event.stopPropagation()}
            sx={sx}
        >
            <Box
                className={`${styles.clippingBox} ${styles.scrollbar__hidden}`}
                onScroll={getActiveChunkIndex}
                ref={clippingBoxRef}
            >
                <MDXContent>{children}</MDXContent>
            </Box>
        </StyledBox>
    );
};
