import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const StyledBox = styled(Box)({
    borderRadius: 'var(--border-radius)',
    // marginBottom: 'auto',
});

interface Props {
};

export default function Card(
    {
    }: Props
): JSX.Element {
    return (
        <StyledBox>
        </StyledBox>
    );
};
