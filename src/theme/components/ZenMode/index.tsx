import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
// import MDXContent from '@theme/MDXContent';
import * as React from 'react';
import ContentFocus from './ContentFocus';
// import styles from './styles.module.css';

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

// TODO(dnguyen0304): Remove development code.
const DebugBox = styled(Box)({
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    zIndex: 10,
});

interface Props {
    readonly children: React.ReactNode;
    readonly isOpen: boolean;
    readonly setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ZenMode(
    {
        children,
        isOpen,
        setIsOpen,
    }: Props,
): JSX.Element {
    // TODO(dnguyen0304): Change active chunk default based on visibility.
    // const [activeChunkIndex] = React.useState<number>(0);

    return (
        <StyledModal
            onClose={() => setIsOpen(false)}
            open={isOpen}
            // Override the default Chrome outline behavior.
            // See: https://github.com/mui/material-ui/issues/11504#issuecomment-390506409
            disableAutoFocus
        >
            <OverlappingLayout onClick={() => setIsOpen(false)}>
                {/* <ContentFull className={styles.scrollbar__hidden}>
                    <MDXContent>{children}</MDXContent>
                </ContentFull>
                <Glass /> */}
                <ContentFocus sx={{
                    alignSelf: 'center',
                    zIndex: Z_INDEX_CONTENT_FOCUS,
                }}>
                    {children}
                </ContentFocus>
            </OverlappingLayout>
        </StyledModal>
    );
};
