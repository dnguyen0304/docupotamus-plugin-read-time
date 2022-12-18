import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const SECOND_TO_MINUTE: number = 60;

interface StyledBoxProps {
    readonly delta: number;
    // TODO(dnguyen0304): Fix not strict typing.
    readonly display: string;
};

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'delta' && prop !== 'display',
})<StyledBoxProps>(({ delta, display }) => {
    let fontSize: string = 'inherit';
    if (delta < 2) {
        fontSize = 'var(--font-size--3)';
    } else if (delta >= 2 && delta < 4) {
        fontSize = 'var(--font-size--2)';
    } else if (delta >= 4) {
        fontSize = 'var(--font-size--1)';
    }
    return {
        position: 'relative',
        '&:after': {
            content: `"+${delta}"`,
            display,
            position: 'absolute',
            bottom: 0,
            left: '100%',
            fontSize,
            lineHeight: fontSize,
            marginLeft: '2px',
        },
    };
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
        const result = readTimeSecond - readTimeSecondPrev.current;
        if (result >= 0) {
            setDelta(result);
        } else {
            setDelta(0);
            // TODO(dnguyen0304): Investigate changing to throwing an error.
            console.log(
                `NegativeMetricDeltaError: current read time ${readTimeSecond} `
                + `is less than previous read time `
                + `${readTimeSecondPrev.current}`
            );
        }
        readTimeSecondPrev.current = readTimeSecond;
    }, [readTimeSecond]);

    return (
        <StyledBox
            component='span'
            delta={delta}
            display={delta ? 'block' : 'none'}
        >
            {format(readTimeSecond, showMinute)}
        </StyledBox>
    );
};
