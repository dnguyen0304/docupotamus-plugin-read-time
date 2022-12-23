import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const StyledBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
});

interface Props {
    readonly children: React.ReactNode;
};

export default function Layout({ children }: Props): JSX.Element {
    return (
        <StyledBox>
            {children}
        </StyledBox>
    );
};
