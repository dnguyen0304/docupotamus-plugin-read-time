import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Stack from '@mui/material/Stack';
import * as React from 'react';

const ICON_WIDTH: string = '24px';

interface Props {
    readonly currRank: number;
    // TODO(dnguyen0304): [P2] Change to store as Rank state.
    readonly prevRank: number;
};

// TODO(dnguyen0304): Add tooltip for rank change.
export default function Rank(
    {
        currRank,
        prevRank,
    }: Props
): JSX.Element {
    const getArrow = (change: number): JSX.Element | null => {
        if (change > 0) {
            // TODO(dnguyen0304): Replace temporary stub color.
            return <ArrowDropUpIcon sx={{ color: 'green' }} />;
        }
        if (change < 0) {
            // TODO(dnguyen0304): Replace temporary stub color.
            return <ArrowDropDownIcon sx={{ color: 'red' }} />;
        }
        return null;
    };

    return (
        <Stack
            direction='column'
            justifyContent='center'
            alignItems='center'
            sx={{ width: ICON_WIDTH }}
        >
            {currRank}
            {getArrow(prevRank - currRank)}
        </Stack>
    );
};
