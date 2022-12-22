import Box from '@mui/material/Box';
import * as React from 'react';

const SECOND_TO_MINUTE: number = 60;

interface Props {
    readonly readTimeSecond: number;
    readonly showMinute: boolean;
};

// TODO(dnguyen0304): Add tooltip for rank change.
export default function Metric(
    {
        readTimeSecond,
        showMinute,
    }: Props
): JSX.Element {
    const format = (totalSeconds: number, showMinute: boolean): string => {
        if (showMinute) {
            const minute = Math.floor(totalSeconds / SECOND_TO_MINUTE);
            const second = Math.round(totalSeconds % SECOND_TO_MINUTE);
            return `${minute}m:${second}s`;
        }
        return `${totalSeconds}s`;
    };

    return (
        <Box sx={{ marginLeft: 'auto' }}>
            {format(readTimeSecond, showMinute)}
        </Box>
    );
};
