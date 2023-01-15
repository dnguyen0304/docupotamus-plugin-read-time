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
    // TODO(dnguyen0304): Extract to a centralized location to facilitate
    //   maintenance.
    backgroundColor: 'rgb(249, 249, 249)',
    borderRadius: '1rem',
    boxShadow: `
        5px 5px 10px 0 rgb(0 0 0 / 5%),
        10px 10px 20px 0 rgb(0 0 0 / 5%),
        20px 20px 40px 0 rgb(0 0 0 / 5%),
        40px 40px 80px 0 rgb(0 0 0 / 5%)`,
}));

const isAdmonition = (classList: DOMTokenList): boolean => {
    return [...classList].some(x => x.startsWith('admonition'));
};

const isCodeBlock = (classList: DOMTokenList): boolean => {
    return [...classList].some(x => x.startsWith('codeBlockContainer'));
};

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
    const clippingBoxRef = React.useRef<HTMLDivElement>();
    const chunksRef = React.useRef<Element[]>([]);

    // TODO(dnguyen0304): Support scrolling.
    // const getActiveChunkIndex = () => {
    //     if (!clippingBoxRef.current) {
    //         return;
    //     }
    //     // TODO(dnguyen0304): Update height with react-resize-detector.
    //     const newChunkIndex = Math.round(
    //         clippingBoxRef.current.scrollTop
    //         / clippingBoxRef.current.getBoundingClientRect().height
    //     );
    //     setChunkIndex(newChunkIndex);
    // };

    // TODO(dnguyen0304): Investigate extracting to useChildElementScroll hook
    //   to minimize duplicated code.
    React.useEffect(() => {
        const chunk = chunksRef.current[chunkIndex];
        if (!chunk) {
            return;
        }
        chunk.scrollIntoView({
            behavior: 'smooth',
            // Because child elements are the same height as the parent element,
            // using center or start are functionally equivalent.
            block: 'start',
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
            if (chunks[i].tagName === 'DIV') {
                if (isAdmonition(chunks[i].classList)) {
                    continue;
                }
                if (isCodeBlock(chunks[i].classList)) {
                    continue
                }
            }
            chunks[i].classList.toggle(styles.chunk);
        }
    }, []);

    return (
        <StyledBox
            onClick={(event) => event.stopPropagation()}
            sx={sx}
        >
            <Box
                className={`${styles.clippingBox} ${styles.scrollbar__hidden}`}
                ref={clippingBoxRef}
            >
                <MDXContent>{children}</MDXContent>
            </Box>
        </StyledBox>
    );
};
