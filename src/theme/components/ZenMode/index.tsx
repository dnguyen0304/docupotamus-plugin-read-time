// import ContentFull from './ContentFull';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import ContentFocus from './ContentFocus';

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

const Glass = styled(Box)({
    width: '100%',
    backdropFilter: 'blur(3px) saturate(30%)',
    '-webkitBackdropFilter': 'blur(3px) saturate(30%)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: Z_INDEX_GLASS,
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
    const [chunkIndex] = React.useState<number>(0);

    return (
        <StyledModal
            onClose={() => setIsOpen(false)}
            open={isOpen}
            // Override the default Chrome outline behavior.
            // See: https://github.com/mui/material-ui/issues/11504#issuecomment-390506409
            disableAutoFocus
        >
            <OverlappingLayout onClick={() => setIsOpen(false)}>
                {/* <ContentFull
                    chunkIndex={chunkIndex}
                    sx={{ zIndex: Z_INDEX_CONTENT_FULL }}
                >
                    {children}
                </ContentFull>
                <Glass /> */}
                <ContentFocus
                    chunkIndex={chunkIndex}
                    sx={{
                        alignSelf: 'center',
                        zIndex: Z_INDEX_CONTENT_FOCUS,
                    }}
                >
                    {children}
                </ContentFocus>
            </OverlappingLayout>
        </StyledModal>
    );
};
