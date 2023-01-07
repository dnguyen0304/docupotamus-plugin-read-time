import type {
    BandFriendlyKey,
    IntersectionSample,
    Selector,
    Target
} from '@docusaurus/plugin-read-time';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RUNNING_TOTALS_UPDATE_RATE_MILLI } from '../../../constants';
import { useSamples } from '../../../contexts/samples';
import { BANDS } from './config';
// import useLocationDelayed from './useLocationDelayed';
// TODO(dnguyen0304): Fix missing module declaration.
import { getElement } from '../../../services/dom';
import { observeVisibility } from '../../../services/visibility';
import { RangeAnchor } from './services/annotator/anchoring/types';
import {
    getElementAll,
    getSnippet,
    getViewportHeight
} from './services/dom';
import { createUpdateRunningTotals } from './services/sampleConsumer';
import { createOnVisibilityChange } from './services/sampleProducer';
import styles from './styles.module.css';
import Tooltip from './Tooltip';

// There is a race condition:
//   (1) The user navigates to a new page.
//   (2) The useLocation hook is called.
//   (3) The useEffect hook with the location dependency is called.
//   (4) getElement is called and finds the content root element of the
//       _previous_ page.
//   (5) The content root element of the previous page is unmounted.
//   (6) The content root element of the new page is mounted.
//   (7) The useEffect hook fails when matching the previous content root
//       element to the new content elements.
//
// Warning: This is unconfirmed. Therefore, include a buffer to delay calling
// the useEffect hook.
// const CONTENT_ROOT_MOUNT_BUFFER_MILLI: number = 3 * 1000;
const BORDER_COLOR: string = 'var(--ifm-hr-background-color)';
const BORDER_HEIGHT_PX: number = 3;

export default function ReadingBands(): JSX.Element | null {
    const {
        contentRootSelector,
        contentSelector,
        debug: {
            band: {
                isEnabled: debugBandIsEnabled,
                colors: bandColors,
            },
            border: {
                isEnabled: debugBorderIsEnabled,
            },
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
            .docupotamusReadTimePlugin;

    // const location = useLocationDelayed(CONTENT_ROOT_MOUNT_BUFFER_MILLI);
    const { setTargetIdToSamples } = useSamples();

    // TODO(dnguyen0304): Investigate migrating from ref to constant.
    // Samples are keyed first for each target then keyed for each band.
    const samples =
        React.useRef<Map<string, Map<BandFriendlyKey, IntersectionSample[]>>>(
            new Map(),
        );
    const viewportHeight = getViewportHeight();

    // Produce intersection samples.
    React.useEffect(() => {
        (async () => {
            const rootElement = await getElement(contentRootSelector);
            const rootRange = new Range();
            rootRange.selectNodeContents(rootElement);

            // TODO(dnguyen0304): Fix code blocks not being included because
            // of "Node cannot be found in the current page." error.
            const elements =
                await getElementAll(contentSelector) as HTMLElement[];

            for (const element of elements) {
                const targetId = uuidv4();

                // TODO(dnguyen0304): Investigate if a clean up removing the
                // data-attribute is needed.
                element.dataset.targetId = targetId;

                const range = new Range();
                range.selectNodeContents(element);

                let selectors: Selector[] = [];
                try {
                    selectors =
                        new RangeAnchor(rootElement, range).toSelector();
                } catch (error) {
                    if (error instanceof RangeError
                        && error.message.includes('Offset exceeds text length')
                    ) {
                        // TODO(dnguyen0304): Support non-text nodes such as
                        // images (<p><img><img/></>).
                        continue;
                    } else {
                        throw error;
                    }
                }

                const target: Target = {
                    id: targetId,
                    source: {
                        href: document.location.href,
                    },
                    selectorRoot:
                        new RangeAnchor(document.body, rootRange).toSelector(),
                    selectors,
                    snippet: getSnippet(element),
                };

                for (const band of BANDS) {
                    const rootMargin =
                        `-${band.topVh * viewportHeight}px `
                        + `0px `
                        + `-${viewportHeight - band.bottomVh * viewportHeight}px`;

                    // TODO(dnguyen0304): Fix unused return value.
                    await observeVisibility({
                        element,
                        onChange: createOnVisibilityChange(
                            samples.current,
                            target,
                            band,
                            element.getBoundingClientRect.bind(element),
                        ),
                        rootMargin,
                        debugBorderIsEnabled,
                    });
                }
            }
        })();
        // TODO(dnguyen0304): Add real implemention for observer.disconnect().
        return () => { };
        // }, [location]);
    }, []);

    // Consume intersection samples.
    React.useEffect(() => {
        const intervalId = window.setInterval(
            createUpdateRunningTotals(samples.current, setTargetIdToSamples),
            RUNNING_TOTALS_UPDATE_RATE_MILLI,
        );
        return () => clearInterval(intervalId);
    }, []);

    return (
        debugBandIsEnabled
            ? <>
                {BANDS.map((band, i) => {
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
};
