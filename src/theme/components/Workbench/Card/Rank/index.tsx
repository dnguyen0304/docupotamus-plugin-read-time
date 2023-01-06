import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import type { StackProps } from '@mui/material/Stack';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { RANK_ICON_WIDTH } from '../../constants';

const ARROW_VIEW_BOX: string = '0 3 24 24';

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
    readonly curr: number;
    readonly prev: number | undefined;
    readonly arrowPosition: ArrowPosition;
};

// TODO(dnguyen0304): Add tooltip for rank change.
export default function Rank(
    {
        curr,
        prev,
        arrowPosition,
    }: Props
): JSX.Element {
    const [isVertical, setIsVertical] = React.useState<boolean>(false);

    const resolvedPrev = (prev !== undefined) ? prev : curr;

    const getIcon = (
        change: number,
        isVertical: boolean,
    ): JSX.Element => {
        if (change > 0) {
            return (
                <ArrowDropUpIcon
                    // TODO(dnguyen0304): Replace temporary placeholder stub.
                    sx={{ color: 'green' }}
                    viewBox={isVertical ? ARROW_VIEW_BOX : undefined}
                />
            );
        }
        if (change < 0) {
            return (
                <ArrowDropDownIcon
                    // TODO(dnguyen0304): Replace temporary placeholder stub.
                    sx={{ color: 'red' }}
                    viewBox={isVertical ? ARROW_VIEW_BOX : undefined}
                />
            );
        }
        return <RemoveIcon viewBox='-12 -12 48 48' />;
    };

    React.useEffect(() => {
        setIsVertical(arrowPosition === 'top' || arrowPosition === 'bottom');
    }, [arrowPosition]);

    return (
        <Stack
            direction={getDirection(arrowPosition)}
            justifyContent='center'
            alignItems='center'
            sx={{ width: isVertical ? RANK_ICON_WIDTH : 'auto' }}
        >
            <Box>{curr}</Box>
            {getIcon(resolvedPrev - curr, isVertical)}
        </Stack>
    );
};
