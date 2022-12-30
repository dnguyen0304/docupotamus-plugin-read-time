import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import useHighlight from '../../hooks/useHighlight';
import usePulse from '../../hooks/usePulse';
import { Card as CardStyles } from '../../styles';
import type { CardProps } from '../../types';
import styles from '../Cards/styles.module.css';

interface StyledBoxProps {
    readonly borderTopColor: React.CSSProperties['borderTopColor'];
};

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'borderTopColor',
})<StyledBoxProps>(({ theme, borderTopColor }) => ({
    ...CardStyles,
    backgroundColor: theme.palette.grey[600],
    borderTop: `var(--space-3xs) solid ${borderTopColor}`,
    fontSize: 'var(--font-size--1)',
    margin: 0,
    transition: 'border-top-color 0.5s ease-in',
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
    const [, setFlicker] = usePulse(targetId);
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
                <Box sx={{
                    fontSize: 'var(--font-size--3)',
                    fontStyle: 'italic',
                }}>
                    {details}
                </Box>
            </Box>
        </StyledBox>
    );
};
