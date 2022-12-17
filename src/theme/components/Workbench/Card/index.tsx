import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { DATA_ATTRIBUTE_CARD_DELTA, DATA_ATTRIBUTE_TARGET_ID } from '../../../../constants';
import { getElement } from '../../../../services/dom';
import Metric from './Metric';
import Rank from './Rank';
import styles from './styles.module.css';

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
    '&:after': {
        content: `attr(${DATA_ATTRIBUTE_CARD_DELTA})`,
        position: 'absolute',
        right: '0',
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
    const ref = React.useRef<HTMLLIElement>(null);
    const readTimeSecondPrev = React.useRef<number>(0);

    // TODO(dnguyen0304): Hide targetId and use shortened
    // heading as the card symbol.
    const truncatedTargetId = targetId.split('-')[0];

    const toggleHighlight = () => {
        element?.classList.toggle(styles.target_container__highlight);
    };

    const scrollIntoView = () => {
        element?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    React.useEffect(() => {
        if (ref.current) {
            const delta = readTimeSecond - readTimeSecondPrev.current;
            ref.current.dataset.cardDelta = `+${delta}`;
            readTimeSecondPrev.current = readTimeSecond;
        }
        return () => {
            ref.current?.removeAttribute(DATA_ATTRIBUTE_CARD_DELTA);
        };
    }, [readTimeSecond]);

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
        <StyledListItem
            onClick={scrollIntoView}
            onMouseEnter={toggleHighlight}
            onMouseLeave={toggleHighlight}
            ref={ref}
        >
            <Rank currRank={currRank} prevRank={prevRank} />
            <Box>
                <Box>{truncatedTargetId}</Box>
                <Box style={{ fontSize: 'var(--font-size--3)' }}>
                    {details}
                </Box>
            </Box>
            <Metric readTimeSecond={readTimeSecond} showMinute={showMinute} />
        </StyledListItem>
    );
};
