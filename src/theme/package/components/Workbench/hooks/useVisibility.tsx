import * as React from 'react';
import { observeVisibility } from '../../../services/visibility';

export default function useVisibility(element: Element | undefined): boolean {
    const [isVisible, setIsVisible] = React.useState<boolean>(false);

    const onChange: IntersectionObserverCallback = (entries) => {
        for (const entry of entries) {
            setIsVisible(entry.isIntersecting);
        }
    }

    React.useEffect(() => {
        (async () => {
            if (element === undefined) {
                return;
            }
            await observeVisibility({
                element,
                onChange,
            });
        })();
    }, [element]);

    return isVisible;
};
