import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const SECOND_TO_MINUTE: number = 60;

interface StyledBoxProps {
    readonly delta: number;
};

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'delta',
})<StyledBoxProps>(({ delta }) => ({
    '&:after': {
        content: `"+${delta}"`,
        position: 'absolute',
        right: '0',
    },
}));

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
    const [delta, setDelta] = React.useState<number>(0);
    const readTimeSecondPrev = React.useRef<number>(0);

    const format = (totalSeconds: number, showMinute: boolean): string => {
        if (showMinute) {
            const minute = Math.floor(totalSeconds / SECOND_TO_MINUTE);
            const second = Math.round(totalSeconds % SECOND_TO_MINUTE);
            return `${minute}m:${second}s`;
        }
        return `${totalSeconds}s`;
    };

    React.useEffect(() => {
        setDelta(readTimeSecond - readTimeSecondPrev.current);
        readTimeSecondPrev.current = readTimeSecond;
    }, [readTimeSecond]);

    return (
        <StyledBox
            component='span'
            delta={delta}
        >
            {format(readTimeSecond, showMinute)}
        </StyledBox>
    );
};
