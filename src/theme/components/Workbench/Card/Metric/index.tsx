import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { DATA_ATTRIBUTE_CARD_DELTA } from '../../../../../constants';

const SECOND_TO_MINUTE: number = 60;

const StyledBox = styled(Box)({
    '&:after': {
        content: `attr(${DATA_ATTRIBUTE_CARD_DELTA})`,
        position: 'absolute',
        right: '0',
    },
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
    const ref = React.useRef<HTMLDivElement>(null);
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
        if (ref.current) {
            const delta = readTimeSecond - readTimeSecondPrev.current;
            ref.current.dataset.cardDelta = `+${delta}`;
            readTimeSecondPrev.current = readTimeSecond;
        }
        return () => {
            ref.current?.removeAttribute(DATA_ATTRIBUTE_CARD_DELTA);
        };
    }, [readTimeSecond]);

    return (
        <StyledBox component='span' ref={ref}>
            {format(readTimeSecond, showMinute)}
        </StyledBox>
    );
};
