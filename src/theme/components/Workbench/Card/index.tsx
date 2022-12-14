import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const MILLISECOND_TO_MINUTE: number = 60 * 1000;
const MILLISECOND_TO_SECOND: number = 1000;

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
    readonly readTimeMilli: number;
};

export default function Card(
    {
        targetId,
        details,
        readTimeMilli,
    }: Props
): JSX.Element {
    const minute = Math.floor(readTimeMilli / MILLISECOND_TO_MINUTE);
    const second = Math.round((readTimeMilli % 60000) / MILLISECOND_TO_SECOND);

    return (
        <StyledList>
            <Box>
                <Box>{targetId}</Box>
                <Box style={{ fontSize: 'var(--font-size--3)' }}>
                    {details}
                </Box>
            </Box>
            <Box component='span'>
                {`${minute}m:${second}s`}
            </Box>
        </StyledList>
    );
};
