import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const KEY_PREFIX: string = 'footerChip';

const StyledBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    // TODO(dnguyen0304): Investigate changing from a wrap to a horizontal
    // scrollbar.
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: 'auto',
});

interface Props {
    readonly seeMinute: boolean;
    readonly setSeeMinute: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Footer(
    {
        seeMinute,
        setSeeMinute,
    }: Props
): JSX.Element {
    return (
        <StyledBox>
            {['See Minutes'].map((label, i) =>
                <Chip
                    key={`${KEY_PREFIX}-${i}`}
                    label={label}
                    clickable
                    onClick={() => setSeeMinute(prev => !prev)}
                    size='medium'
                    variant='outlined'
                    sx={{
                        backgroundColor:
                            (seeMinute)
                                ? 'rgba(255, 255, 255, 0.4)'
                                : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        margin: '10px 12px 0 0',
                        padding: '0 12px',
                        transition: `
                            background-color
                            0.5s
                            cubic-bezier(0.05, 0, 0, 1)`,
                        // Use a higher specificity to override the default
                        // style.
                        // See: https://stackoverflow.com/questions/63349154/change-material-ui-outlined-chip-focus-and-hover-color
                        '&&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                    }}
                />
            )}
        </StyledBox>
    );
};
