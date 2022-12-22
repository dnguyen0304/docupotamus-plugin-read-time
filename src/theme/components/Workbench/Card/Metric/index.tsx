import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const SECOND_TO_MINUTE: number = 60;

const format = (totalSeconds: number, showMinute: boolean): string => {
    if (showMinute) {
        const minute = Math.floor(totalSeconds / SECOND_TO_MINUTE);
        const second = Math.round(totalSeconds % SECOND_TO_MINUTE);
        return `${minute}m:${second}s`;
    }
    return `${totalSeconds}s`;
};

const StyledBox = styled(Box)({
    // TODO(dnguyen0304): Replace temporary placeholder stub.
    backgroundColor: 'darkgreen',
    borderRadius: '2px',
    // flexBasis: '80px',
    marginLeft: 'auto',
    padding: '0 var(--space-3xs)',
    textAlign: 'right',
});

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
    return (
        <StyledBox>
            {format(readTimeSecond, showMinute)}
        </StyledBox>
    );
};
