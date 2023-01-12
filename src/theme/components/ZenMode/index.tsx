import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import MDXContent from '@theme/MDXContent';
import * as React from 'react';
import styles from './styles.module.css';

const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'grid',
    // Modal adds an empty "sentinel" element before and after the children.
    gridTemplateRows: '0 1fr 0',
    placeItems: 'center',
    '& .MuiBackdrop-root': {
        backgroundColor: theme.palette.background.paper,
    },
}));

const StyledBox = styled(Box)({
    // TODO(dnguyen0304): Fix missing responsive design.
    width: '60%',
    minHeight: '40%',
    borderRadius: '1rem',
    boxShadow: `
        5px 5px 10px 0 rgb(0 0 0 / 5%),
        10px 10px 20px 0 rgb(0 0 0 / 5%),
        20px 20px 40px 0 rgb(0 0 0 / 5%),
        40px 40px 80px 0 rgb(0 0 0 / 5%)`,
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
    const [activeChunkIndex] = React.useState<number>(0);
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
                if (i === activeChunkIndex) {
                    chunks[i].classList.toggle(styles.chunk__active);
                } else {
                    chunks[i].classList.toggle(styles.chunk__notActive);
                }
            }
        },
        [activeChunkIndex],
    );

    return (
        <StyledModal
            onClose={() => setIsOpen(false)}
            open={isOpen}
            // Override the default Chrome outline behavior.
            // See: https://github.com/mui/material-ui/issues/11504#issuecomment-390506409
            disableAutoFocus
        >
            <StyledBox ref={handleRefChange}>
                <MDXContent>{children}</MDXContent>
            </StyledBox>
        </StyledModal>
    );
};
