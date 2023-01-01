import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { getElement } from '../../../../services/dom';
import styles from './styles.module.css';

interface Props extends IntersectionObserverInit {
    readonly element: Element | string;
    readonly onChange: IntersectionObserverCallback;
    readonly debugBorderIsEnabled?: boolean;
};

export const observeVisibility = async (
    {
        element,
        onChange,
        root,
        rootMargin,
        threshold,
        debugBorderIsEnabled = false,
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

    // TODO(dnguyen0304): Investigate extracting because it adds another
    //   responsibility.
    // TODO(dnguyen0304): Add tooltip with visibility.
    if (debugBorderIsEnabled
        && !resolvedElement.classList.contains(styles.visibilityObserver_target)
    ) {
        resolvedElement.classList.add(styles.visibilityObserver_target);
        cleanUp.push(() => {
            resolvedElement.classList.remove(styles.visibilityObserver_target);
        });
    }

    observer.observe(resolvedElement);
    cleanUp.push(() => observer.unobserve(resolvedElement));

    return cleanUp;
};
