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
    return (
        <StyledBox
            className={styles.scrollbar__hidden}
            sx={sx}
        >
            <MDXContent>{children}</MDXContent>
        </StyledBox>
    );
};
