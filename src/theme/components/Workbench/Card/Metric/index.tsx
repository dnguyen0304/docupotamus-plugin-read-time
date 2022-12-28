import Box from '@mui/material/Box';
import { styled, SxProps, Theme } from '@mui/material/styles';
import * as React from 'react';
import { RANK_ICON_WIDTH } from '../../constants';

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
};

// TODO(dnguyen0304): Investigate adding fixed width style.
const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'hasImproved',
})<StyledBoxProps>(({ hasImproved }) => ({
    width: 'fit-content',
    minWidth: 'min(50px, 100%)',
    // TODO(dnguyen0304): Replace temporary placeholder stub.
    backgroundColor: hasImproved ? 'darkgreen' : 'transparent',
    borderRadius: '2px',
    lineHeight: RANK_ICON_WIDTH,
    marginLeft: 'auto',
    padding: '0 var(--space-3xs)',
}));

interface Props {
    readonly readTimeSecond: number;
    readonly showMinute: boolean;
    readonly sx?: SxProps<Theme>;
};

// TODO(dnguyen0304): Add tooltip for rank change.
export default function Metric(
    {
        readTimeSecond,
        showMinute,
        sx,
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
        <Box sx={{ flexGrow: 1 }}>
            <StyledBox hasImproved={hasImproved} sx={sx}>
                {format(readTimeSecond, showMinute)}
            </StyledBox>
        </Box>
    );
};
