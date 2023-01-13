import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import MDXContent from '@theme/MDXContent';
import * as React from 'react';
import styles from './styles.module.css';

const Z_INDEX_CONTENT_FULL: React.CSSProperties['zIndex'] = 1;
const Z_INDEX_GLASS: React.CSSProperties['zIndex'] = Z_INDEX_CONTENT_FULL + 1;
const Z_INDEX_CONTENT_FOCUS: React.CSSProperties['zIndex'] = Z_INDEX_GLASS + 1;

// TODO(dnguyen0304): Fix confusing intrinsic sizing.
const StyledModal = styled(Modal)(({ theme }) => ({
    '& .MuiBackdrop-root': {
        backgroundColor: theme.palette.background.paper,
    },
}));

const OverlappingLayout = styled(Box)({
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr',
    justifyItems: 'center',
    '& > *': {
        gridColumnStart: 1,
        gridRowStart: 1,
    },
});

const ContentFull = styled(Box)({
    // TODO(dnguyen0304): Fix missing responsive design.
    width: '40%',
    height: '100%',
    overflowY: 'scroll',
    padding: '50vh 0',
    zIndex: Z_INDEX_CONTENT_FULL,
});

const Glass = styled(Box)({
    width: '100%',
    backdropFilter: 'blur(3px) saturate(30%)',
    '-webkitBackdropFilter': 'blur(3px) saturate(30%)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: Z_INDEX_GLASS,
});

const ContentFocus = styled(Box)(({ theme }) => ({
    display: 'grid',
    placeItems: 'center',
    // TODO(dnguyen0304): Fix missing responsive design.
    width: '60%',
    height: '60%',
    alignSelf: 'center',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1rem',
    boxShadow: `
        5px 5px 10px 0 rgb(0 0 0 / 5%),
        10px 10px 20px 0 rgb(0 0 0 / 5%),
        20px 20px 40px 0 rgb(0 0 0 / 5%),
        40px 40px 80px 0 rgb(0 0 0 / 5%)`,
    zIndex: Z_INDEX_CONTENT_FOCUS,
}));

// TODO(dnguyen0304): Remove development code.
const DebugBox = styled(Box)({
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    zIndex: 10,
});

interface Props {
    children: React.ReactNode;
};

export default function ZenMode(
    {
        children,
    }: Props,
): JSX.Element {
    // TODO(dnguyen0304): Remove development code.
    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    // TODO(dnguyen0304): Change active chunk default based on visibility.
    // const [activeChunkIndex] = React.useState<number>(0);
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
        <StyledModal
            open={isOpen}
            // Override the default Chrome outline behavior.
            // See: https://github.com/mui/material-ui/issues/11504#issuecomment-390506409
            disableAutoFocus
        >
            <OverlappingLayout onClick={() => setIsOpen(false)}>
                <ContentFull className={styles.scrollbar__hidden}>
                    <MDXContent>{children}</MDXContent>
                </ContentFull>
                <Glass />
                <ContentFocus />
            </OverlappingLayout>
            {/* <Box
                    className={`${styles.clippingBox} ${styles.scrollbar__hidden}`}
                    ref={handleRefChange}
                >
                    <MDXContent>{children}</MDXContent>
                </Box> */}
        </StyledModal>
    );
};
