import Box from '@mui/material/Box';
import { styled, SxProps, Theme } from '@mui/material/styles';
import * as React from 'react';
import { METRIC_BORDER_WIDTH, RANK_ICON_WIDTH } from '../../constants';
import Delta from './Delta';

const SECOND_TO_MINUTE: number = 60;

const format = (totalSeconds: number, showMinute: boolean): string => {
    if (showMinute) {
        const minute = Math.floor(totalSeconds / SECOND_TO_MINUTE);
        const second = Math.round(totalSeconds % SECOND_TO_MINUTE);
        return `${minute}m:${second}s`;
    }
    return `${totalSeconds}s`;
};

interface StyledBoxProps {
    readonly hasImproved: boolean;
    readonly minWidthFactor: number,
};

// TODO(dnguyen0304): [P2] Investigate refactoring the parent-to-child container
// styles relationship.
// TODO(dnguyen0304): Fix styles not updating on hover.
const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'hasImproved' && prop !== 'minWidthFactor',
})<StyledBoxProps>(({ hasImproved, minWidthFactor }) => ({
    width: 'fit-content',
    minWidth: `min(calc(${minWidthFactor} * 50px), 100%)`,
    // TODO(dnguyen0304): Replace temporary placeholder stub.
    backgroundColor: hasImproved ? 'darkgreen' : 'transparent',
    borderColor: hasImproved ? 'transparent' : 'rgba(255, 255, 255, 0.8)',
    borderRadius: '2px',
    borderStyle: 'solid',
    borderWidth: METRIC_BORDER_WIDTH,
    lineHeight: RANK_ICON_WIDTH,
    marginLeft: 'auto',
    padding: '0 var(--space-3xs)',
}));

interface Props {
    readonly readTimeSecond: number;
    readonly showMinute: boolean;
    readonly marginLeftFactor?: number,
    readonly minWidthFactor?: number,
    readonly sx?: SxProps<Theme>;
    readonly withDelta?: boolean;
};

// TODO(dnguyen0304): Add tooltip for rank change.
export default function Metric(
    {
        readTimeSecond,
        showMinute,
        marginLeftFactor = 1,
        minWidthFactor = 1,
        sx,
        withDelta = false,
    }: Props
): JSX.Element {
    const [originalReadTimeSecond, setOriginalReadTimeSecond] =
        React.useState<number>();
    const [hasImproved, setHasImproved] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (originalReadTimeSecond === undefined) {
            setOriginalReadTimeSecond(readTimeSecond);
        } else {
            setHasImproved(readTimeSecond > originalReadTimeSecond);
        }
    }, [readTimeSecond]);

    return (
        <Box sx={{
            position: 'relative',
            flexGrow: 1,
            marginLeft: `calc(${marginLeftFactor} * var(--space-3xs))`,
        }}>
            <StyledBox
                hasImproved={hasImproved}
                minWidthFactor={minWidthFactor}
                sx={sx}
            >
                {format(readTimeSecond, showMinute)}
            </StyledBox>
            {withDelta ? <Delta readTimeSecond={readTimeSecond} /> : null}
        </Box>
    );
};
