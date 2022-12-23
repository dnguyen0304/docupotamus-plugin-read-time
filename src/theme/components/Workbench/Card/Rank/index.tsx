import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import type { StackProps } from '@mui/material/Stack';
import Stack from '@mui/material/Stack';
import * as React from 'react';

const ICON_WIDTH: string = '24px';

type ArrowPosition = 'top' | 'right' | 'bottom' | 'left';

const getDirection = (
    arrowPosition: ArrowPosition,
): StackProps['direction'] => {
    switch (arrowPosition) {
        case 'top':
            return 'column-reverse';
        case 'right':
            return 'row';
        case 'bottom':
            return 'column';
        case 'left':
            return 'row-reverse';
    }
};

interface Props {
    readonly currRank: number;
    readonly prevRank: number;
    readonly arrowPosition: ArrowPosition;
};

// TODO(dnguyen0304): Add tooltip for rank change.
export default function Rank(
    {
        currRank,
        prevRank,
        arrowPosition,
    }: Props
): JSX.Element {
    const getArrow = (change: number): JSX.Element | null => {
        if (change > 0) {
            // TODO(dnguyen0304): Replace temporary placeholder stub.
            return <ArrowDropUpIcon sx={{ color: 'green' }} />;
        }
        if (change < 0) {
            // TODO(dnguyen0304): Replace temporary placeholder stub.
            return <ArrowDropDownIcon sx={{ color: 'red' }} />;
        }
        return null;
    };

    return (
        <Stack
            direction={getDirection(arrowPosition)}
            justifyContent='center'
            alignItems='center'
            sx={{ width: ICON_WIDTH }}
        >
            {currRank}
            {getArrow(prevRank - currRank)}
        </Stack>
    );
};
