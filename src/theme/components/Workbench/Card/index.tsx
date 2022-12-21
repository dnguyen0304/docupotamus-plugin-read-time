import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { DATA_ATTRIBUTE_TARGET_ID } from '../../../../constants';
import { getElement } from '../../../../services/dom';
import {
    BOX_SHADOW_INNER_WIDTH_REM,
    BOX_SHADOW_OUTER_WIDTH_REM
} from '../constants';
import Metric from './Metric';
import MetricDelta from './MetricDelta';
import Rank from './Rank';
import styles from './styles.module.css';

const StyledListItem = styled('li')({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgb(48, 56, 70)',
    borderRadius: 'var(--space-2xs)',
    color: '#fff',
    fontSize: 'var(--font-size--2)',
    margin: `${BOX_SHADOW_INNER_WIDTH_REM + BOX_SHADOW_OUTER_WIDTH_REM}rem`,
    // TODO(dnguyen0304): Investigate decreasing to have vertical symmetry with
    // Workbench padding-left style.
    marginRight: `calc(`
        + `${BOX_SHADOW_INNER_WIDTH_REM + BOX_SHADOW_OUTER_WIDTH_REM}rem`
        + ` + `
        + `var(--space-xs))`,
    padding: 'var(--space-2xs)',
    '&:hover': {
        boxShadow: `
            #fff 0 0 0 ${BOX_SHADOW_INNER_WIDTH_REM}rem,
            rgb(100, 255, 218) 0 0 0 ${BOX_SHADOW_OUTER_WIDTH_REM}rem`,
    },
});

interface Props {
    readonly targetId: string;
    readonly currRank: number;
    readonly prevRank: number;
    readonly details: string;
    readonly readTimeSecond: number;
    readonly showMinute: boolean;
};

export default function Card(
    {
        targetId,
        currRank,
        prevRank,
        details,
        readTimeSecond,
        showMinute,
    }: Props
): JSX.Element {
    const [element, setElement] = React.useState<Element>();
    const [flickerIsEnabled, setFlickerIsEnabled] =
        React.useState<boolean>(false);

    // TODO(dnguyen0304): Hide targetId and use shortened
    // heading as the card symbol.
    const truncatedTargetId = targetId.split('-')[0];

    const toggleHighlight = () => {
        element?.classList.toggle(styles.target_container__highlight);
    };

    const handleClick = () => {
        element?.classList.remove(styles.target_container__flicker);
        element?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
        setFlickerIsEnabled(true);
    };

    // TODO(dnguyen0304): Investigate extracting into a custom hook.
    React.useEffect(() => {
        (async () => {
            if (!ExecutionEnvironment.canUseDOM) {
                return;
            }
            const targetElement =
                await getElement(`[${DATA_ATTRIBUTE_TARGET_ID}="${targetId}"]`);
            setElement(targetElement);
        })();
        return () => {
            element?.classList.remove(styles.target_container__highlight);
        };
    }, []);

    React.useEffect(() => {
        if (flickerIsEnabled) {
            element?.classList.add(styles.target_container__flicker);
        } else {
            element?.classList.remove(styles.target_container__flicker);
        }
    }, [flickerIsEnabled]);

    return (
        <StyledListItem
            onAnimationEnd={() => setFlickerIsEnabled(false)}
            onClick={handleClick}
            onMouseEnter={toggleHighlight}
            onMouseLeave={toggleHighlight}
        >
            <Rank currRank={currRank} prevRank={prevRank} />
            <Box sx={{ margin: '0 6px 0 4px' }}>
                <Box>{truncatedTargetId}</Box>
                <Box style={{ fontSize: 'var(--font-size--3)' }}>
                    {details}
                </Box>
            </Box>
            <Metric readTimeSecond={readTimeSecond} showMinute={showMinute} />
            <MetricDelta readTimeSecond={readTimeSecond} />
        </StyledListItem>
    );
};
