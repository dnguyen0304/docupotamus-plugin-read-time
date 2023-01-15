import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { HotKeys, KeyMap } from 'react-hotkeys';
import ContentFocus from './ContentFocus';
import ContentFull from './ContentFull';

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
    WebkitBackdropFilter: 'blur(3px) saturate(30%)',
    // TODO(dnguyen0304): Extract to a centralized location to facilitate
    //   maintenance.
    backgroundColor: 'rgba(232, 232, 232, 0.6)',
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
    const [chunkIndex, setChunkIndex] = React.useState<number>(0);

    const keyMap: KeyMap = React.useMemo(() => ({
        CHUNK_DOWN: 'down',
        CHUNK_UP: 'up',
    }), []);

    const handlers: {
        [key: string]: (keyEvent?: KeyboardEvent | undefined) => void;
    } = React.useMemo(() => ({
        CHUNK_DOWN: () => setChunkIndex(prev => prev + 1),
        CHUNK_UP: () => setChunkIndex(prev => prev ? prev - 1 : 0),
    }), []);

    return (
        <HotKeys
            handlers={handlers}
            keyMap={keyMap}
        >
            <StyledModal
                onClose={() => setIsOpen(false)}
                open={isOpen}
                // Override the default Chrome outline behavior.
                // See: https://github.com/mui/material-ui/issues/11504#issuecomment-390506409
                disableAutoFocus
            >
                <OverlappingLayout onClick={() => setIsOpen(false)}>
                    <ContentFull
                        chunkIndex={chunkIndex}
                        sx={{ zIndex: Z_INDEX_CONTENT_FULL }}
                    >
                        {children}
                    </ContentFull>
                    <Glass />
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
        </HotKeys>
    );
};
