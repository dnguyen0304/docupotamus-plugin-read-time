import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const StyledList = styled('li')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgb(48, 56, 70)',
    borderRadius: 'var(--space-2xs)',
    color: 'white',
    fontSize: 'var(--font-size--2)',
    padding: 'var(--space-2xs)',
    '&:hover': {
        boxShadow: `
                white 0 0 0 0.3rem,
                rgb(100, 255, 218) 0 0 0 0.5rem`,
    },
});

interface Props {
    readonly targetId: string;
    readonly details: string;
    readTime: {
        readonly minute: number;
        readonly second: number;
    };
};

export default function Card(
    {
        targetId,
        details,
        readTime,
    }: Props
): JSX.Element {
    return (
        <StyledList>
            <Box>
                <Box>{targetId}</Box>
                <Box style={{ fontSize: 'var(--font-size--3)' }}>
                    {details}
                </Box>
            </Box>
            <Box component='span'>
                {`${readTime.minute}m:${readTime.second}s`}
            </Box>
        </StyledList>
    );
};
