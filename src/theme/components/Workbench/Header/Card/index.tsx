import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import useFlicker from '../../hooks/useFlicker';
import useHighlight from '../../hooks/useHighlight';
import { Card as CardStyles } from '../../styles';
import type { CardProps } from '../../types';
import styles from '../Cards/styles.module.css';

interface StyledBoxProps {
    readonly borderTopColor: React.CSSProperties['borderTopColor'];
};

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'borderTopColor',
})<StyledBoxProps>(({ borderTopColor }) => ({
    ...CardStyles,
    borderTop: `var(--space-3xs) solid ${borderTopColor}`,
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
