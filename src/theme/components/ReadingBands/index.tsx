import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import type { DocupotamusThemeConfig } from '../../../utils';
import { getViewportHeight } from '../../../utils';
import type { Band } from './reading-bands';
import styles from './styles.module.css';
import Tooltip from './Tooltip';
import observeVisibility from './VisibilityService';

const CENTER: number = .5;
const STANDARD_DEVIATION_1: number = .341;
const STANDARD_DEVIATION_2: number = .477;
const B0_MULTIPLIER: number = 1.0;
const B1_MULTIPLIER: number = 0.8;
const B2_MULTIPLIER: number = 0.4;
const BORDER_COLOR: string = 'var(--ifm-hr-background-color)';
const BORDER_HEIGHT_PX: number = 3;

const bands: Band[] = [
    {
        friendlyKey: 'B2-top',
        topVh: 0,
        bottomVh: CENTER - STANDARD_DEVIATION_2,
        multiplier: B2_MULTIPLIER,
    },
    {
        friendlyKey: 'B1-top',
        topVh: CENTER - STANDARD_DEVIATION_2,
        bottomVh: CENTER - STANDARD_DEVIATION_1,
        multiplier: B1_MULTIPLIER,
    },
    {
        friendlyKey: 'B0',
        topVh: CENTER - STANDARD_DEVIATION_1,
        bottomVh: CENTER + STANDARD_DEVIATION_1,
        multiplier: B0_MULTIPLIER,
    },
    {
        friendlyKey: 'B1-bottom',
        topVh: CENTER + STANDARD_DEVIATION_1,
        bottomVh: CENTER + STANDARD_DEVIATION_2,
        multiplier: B1_MULTIPLIER,
    },
    {
        friendlyKey: 'B2-bottom',
        topVh: CENTER + STANDARD_DEVIATION_2,
        bottomVh: 1.0,
        multiplier: B2_MULTIPLIER,
    },
];

export default function ReadingBands(): JSX.Element | null {
    const {
        readTime: {
            debug: {
                band: {
                    isEnabled: debugBandIsEnabled,
                    colors: bandColors,
                },
                border: {
                    isEnabled: debugBorderIsEnabled,
                },
            },
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
        .docupotamus as DocupotamusThemeConfig;

    const viewportHeight = getViewportHeight();

    const createVisibilityRef = (
        topPx: number,
        bottomPx: number,
        viewportHeight: number,
    ): React.RefCallback<HTMLDivElement> => {
        return React.useCallback(async (node: HTMLDivElement | null) => {
            if (node !== null) {

                await observeVisibility({
                    // TODO(dnguyen0304): Change to include all child elements.
                    selector: `main[class*='docMainContainer'] article .markdown h2`,
                    rootMargin: `-${topPx}px 0px -${viewportHeight - bottomPx}px`,
                    debugBorderIsEnabled,
                });
            }
        }, []);
    };

    return (
        debugBandIsEnabled
            ? <>
                {bands.map((band, i) => {
                    const topPx = band.topVh * viewportHeight;
                    const bottomPx = band.bottomVh * viewportHeight;
                    const heightPx = bottomPx - topPx;
                    // TODO(dnguyen0304): Support animation on hover.
                    return (
                        <Tooltip
                            key={band.friendlyKey}
                            index={i}
                            topPx={topPx}
                            bottomPx={bottomPx}
                        >
                            <div
                                ref={createVisibilityRef(
                                    topPx,
                                    bottomPx,
                                    viewportHeight,
                                )}
                                className={styles.readingBands}
                                style={{
                                    backgroundColor: bandColors[i],
                                    borderTop:
                                        (i !== 0)
                                            ? `${BORDER_HEIGHT_PX}px solid ${BORDER_COLOR}`
                                            : ''
                                    ,
                                    height: `${heightPx}px`,
                                    top: `${topPx}px`,
                                }}
                            />
                        </Tooltip>
                    );
                })}
            </>
            : null
    );
}