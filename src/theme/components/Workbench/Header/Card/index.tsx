import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import {
    CARD_BOX_SHADOW_INNER_WIDTH_REM,
    CARD_BOX_SHADOW_OUTER_WIDTH_REM
} from '../../constants';
import useFlicker from '../../hooks/useFlicker';
import useHighlight from '../../hooks/useHighlight';
import type { CardProps } from '../../types';
import styles from '../Cards/styles.module.css';

interface StyledBoxProps {
    readonly borderTopColor: React.CSSProperties['borderTopColor'];
};

// TODO(dnguyen0304): Fix duplication with Workbench/ListItem component.
const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'borderTopColor',
})<StyledBoxProps>(({ borderTopColor }) => ({
    backgroundColor: 'rgb(48, 56, 70)',
    borderRadius: 'var(--border-radius)',
    borderTop: `var(--space-3xs) solid ${borderTopColor}`,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 'var(--font-size--2)',
    padding: 'var(--space-2xs)',
    transition: 'border-top-color 0.5s ease-in',
    '&:hover': {
        boxShadow: `
            #fff 0 0 0 ${CARD_BOX_SHADOW_INNER_WIDTH_REM}rem,
            rgb(100, 255, 218) 0 0 0 ${CARD_BOX_SHADOW_OUTER_WIDTH_REM}rem`,
    },
}));

interface Props extends Pick<CardProps,
    'className' |
    'targetId' |
    'details'
> {
    onClick: () => void;
    rankColor: React.CSSProperties['color'];
};

export default function Card(
    {
        className,
        targetId,
        details,
        rankColor,
        onClick = () => { },
    }: Props
): JSX.Element {
    const [, setFlicker] = useFlicker(targetId);
    const [, setHighlight] = useHighlight(targetId);

    // TODO(dnguyen0304): Hide targetId and use shortened
    // heading as the card symbol.
    const truncatedTargetId = targetId.split('-')[0];

    const handleClick = () => {
        onClick();
        setFlicker(true);
    };

    return (
        <StyledBox
            className={className}
            borderTopColor={
                className?.includes(styles.card__clicked)
                    ? rankColor
                    : 'transparent'
            }
            onAnimationEnd={() => setFlicker(false)}
            onClick={handleClick}
            onMouseEnter={() => setHighlight(true)}
            onMouseLeave={() => setHighlight(false)}
        >
            <Box sx={{ margin: '0 6px 0 4px' }}>
                <Box>{truncatedTargetId}</Box>
                <Box style={{ fontSize: 'var(--font-size--3)' }}>
                    {details}
                </Box>
            </Box>
        </StyledBox>
    );
};
