import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Symbol from '../../Card/Symbol';
import useHighlight from '../../hooks/useHighlight';
import usePulse from '../../hooks/usePulse';
import useVisibility from '../../hooks/useVisibility';
import { Card as CardStyles } from '../../styles';
import type { CardProps } from '../../types';
import styles from '../Cards/styles.module.css';

interface StyledBoxProps {
    readonly rankColor: React.CSSProperties['color'];
    readonly targetIsVisible: boolean;
};

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'rankColor' && prop !== 'targetIsVisible',
})<StyledBoxProps>(({ theme, rankColor, targetIsVisible }) => ({
    ...CardStyles,
    position: 'relative',  // Create a positioning context for icon.
    backgroundColor: theme.palette.grey[600],
    borderTop: 'var(--space-3xs) solid transparent',
    fontSize: 'var(--font-size--1)',
    margin: 0,
    transition: 'border-top-color 0.5s ease-in',
    ...(targetIsVisible && {
        // TODO(dnguyen0304): Extract to a centralized location to facilitate
        // maintenance.
        backgroundColor: 'rgba(252, 201, 53, 0.2)',
    }),
    '&:hover': {
        borderTopColor: rankColor,
    },
    // TODO(dnguyen0304): Investigate a less awkward transition.
    [`&.${styles.card__clicked}:hover`]: {
        backgroundColor: theme.palette.grey[600],
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
    const [, setPulse] = usePulse(targetId);
    const [, setHighlight] = useHighlight(targetId);
    const targetIsVisible = useVisibility(targetId);

    const handleClick = () => {
        onClick();
        setPulse(true);
    };

    return (
        <StyledBox
            className={className}
            onAnimationEnd={() => setPulse(false)}
            onClick={handleClick}
            onMouseEnter={() => setHighlight(true)}
            onMouseLeave={() => setHighlight(false)}
            rankColor={rankColor}
            targetIsVisible={targetIsVisible}
        >
            <Box sx={{
                margin: '0 6px 0 4px',
                paddingBottom: 'var(--space-2xs-xs)',
            }}>
                <Symbol />
                <Box sx={{
                    fontSize: 'var(--font-size--3)',
                    fontStyle: 'italic',
                }}>
                    {details}
                </Box>
            </Box>
            <WorkspacePremiumOutlinedIcon sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                color: rankColor,
                fontSize: 'var(--step-1)',
                translate: '-50% 50%',
            }} />
        </StyledBox>
    );
};
