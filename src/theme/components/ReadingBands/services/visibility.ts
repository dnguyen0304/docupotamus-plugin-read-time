import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { DATA_ATTRIBUTE_TARGET_ID } from '../../../../constants';
import { getElement } from '../../../../services/dom';
import styles from './styles.module.css';

interface Props extends IntersectionObserverInit {
    readonly element: Element | string;
    readonly onChange: IntersectionObserverCallback;
    readonly debugBorderIsEnabled?: boolean;
    readonly targetId?: string;
};

export const observeVisibility = async (
    {
        element,
        onChange,
        root,
        rootMargin,
        threshold,
        debugBorderIsEnabled = false,
        // TODO(dnguyen0304): Fix complex conditional parameters.
        targetId = '',
    }: Props
): Promise<Array<() => void>> => {
    const env = ExecutionEnvironment;
    if (!env.canUseDOM || !env.canUseIntersectionObserver) {
        return [];
    }

    const cleanUp: Array<() => void> = [];
    const resolvedElement =
        typeof element === 'string'
            ? await getElement(element)
            : element;
    const observer = new IntersectionObserver(
        onChange,
        {
            root,
            rootMargin,
            threshold,
        },
    );

    // TODO(dnguyen0304): Add tooltip with visibility.
    if (debugBorderIsEnabled
        && !resolvedElement.classList.contains(styles.visibilityObserver_target)
    ) {
        resolvedElement.classList.add(styles.visibilityObserver_target);
        if (resolvedElement instanceof HTMLElement) {
            resolvedElement.dataset.targetId = targetId;
        }
        cleanUp.push(() => {
            resolvedElement.classList.remove(styles.visibilityObserver_target);
            if (resolvedElement instanceof HTMLElement) {
                // The MDN recommendation is to use the delete keyword, but that
                // is not compatible with Safari.
                resolvedElement.removeAttribute(DATA_ATTRIBUTE_TARGET_ID);
            }
        });
    }

    observer.observe(resolvedElement);
    cleanUp.push(() => observer.unobserve(resolvedElement));

    return cleanUp;
};
