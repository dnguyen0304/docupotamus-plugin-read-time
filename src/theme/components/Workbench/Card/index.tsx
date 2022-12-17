import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { DATA_ATTRIBUTE_TARGET_ID } from '../../../../constants';
import { getElement } from '../../../../services/dom';
import styles from './styles.module.css';

const SECOND_TO_MINUTE: number = 60;
const BOX_SHADOW_INNER_WIDTH_REM: number = 0.3;
const BOX_SHADOW_OUTER_WIDTH_REM: number = 0.5;

const StyledListItem = styled('li')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(48, 56, 70)',
    borderRadius: 'var(--space-2xs)',
    color: '#fff',
    fontSize: 'var(--font-size--2)',
    margin: `${BOX_SHADOW_INNER_WIDTH_REM + BOX_SHADOW_OUTER_WIDTH_REM}rem`,
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
    readonly seeMinute: boolean;
};

export default function Card(
    {
        targetId,
        currRank,
        prevRank,
        details,
        readTimeSecond,
        seeMinute,
    }: Props
): JSX.Element {
    const [element, setElement] = React.useState<Element>();

    // TODO(dnguyen0304): Hide targetId and use shortened
    // heading as the card symbol.
    const truncatedTargetId = targetId.split('-')[0];
    const rankChange = prevRank - currRank;

    const toggleHighlight = () => {
        element?.classList.toggle(styles.target_container__highlight);
    };

    const scrollIntoView = () => {
        element?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    const getRankChange = (change: number): JSX.Element => {
        if (change > 0) {
            // TODO(dnguyen0304): Replace temporary stub color.
            return <ArrowDropUpIcon sx={{ color: 'green' }} />;
        } else if (change < 0) {
            // TODO(dnguyen0304): Replace temporary stub color.
            return <ArrowDropDownIcon sx={{ color: 'red' }} />;
        }
        return <ArrowDropUpIcon sx={{ visibility: 'hidden' }} />;
    };

    const getReadTime = (): string => {
        if (seeMinute) {
            const minute = Math.floor(readTimeSecond / SECOND_TO_MINUTE);
            const second = Math.round(readTimeSecond % SECOND_TO_MINUTE);
            return `${minute}m:${second}s`;
        } else {
            return `${readTimeSecond}s`;
        }
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

    return (
        <Tooltip title={rankChange}>
            <StyledListItem
                onClick={scrollIntoView}
                onMouseEnter={toggleHighlight}
                onMouseLeave={toggleHighlight}
            >
                <Stack
                    direction='column'
                    justifyContent='center'
                    alignItems='center'
                >
                    {currRank}
                    {getRankChange(rankChange)}
                </Stack>
                <Box>
                    <Box>{truncatedTargetId}</Box>
                    <Box style={{ fontSize: 'var(--font-size--3)' }}>
                        {details}
                    </Box>
                </Box>
                <Box component='span'>
                    {getReadTime()}
                </Box>
            </StyledListItem>
        </Tooltip>
    );
};
