import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { DATA_ATTRIBUTE_TARGET_ID } from '../../../../constants';
import { getElement } from '../../../../services/dom';
import styles from './styles.module.css';

const MILLISECOND_TO_MINUTE: number = 60 * 1000;
const MILLISECOND_TO_SECOND: number = 1000;
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
    readonly details: string;
    readonly readTimeMilli: number;
    readonly seeMinute: boolean;
};

export default function Card(
    {
        targetId,
        details,
        readTimeMilli,
        seeMinute,
    }: Props
): JSX.Element {
    const [element, setElement] = React.useState<Element>();

    // TODO(dnguyen0304): Hide targetId and use shortened
    // heading as the card symbol.
    const truncatedTargetId = targetId.split('-')[0];

    const toggleHighlight = () => {
        element?.classList.toggle(styles.target_container__highlight);
    };

    const getReadTime = (): string => {
        if (seeMinute) {
            const minute = Math.floor(readTimeMilli / MILLISECOND_TO_MINUTE);
            const second =
                Math.round(readTimeMilli % 60000 / MILLISECOND_TO_SECOND);
            return `${minute}m:${second}s`;
        } else {
            return `${Math.round(readTimeMilli / MILLISECOND_TO_SECOND)}s`;
        }
    };

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
        <StyledListItem onClick={toggleHighlight}>
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
    );
};
