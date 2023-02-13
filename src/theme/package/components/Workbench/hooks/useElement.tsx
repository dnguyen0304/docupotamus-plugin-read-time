import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import * as React from 'react';
import { getElement } from '../../../services/dom';

export default function useElement(
    targetId: string,
    cleanUp?: () => void,
): Element | undefined {
    const [element, setElement] = React.useState<Element>();

    React.useEffect(() => {
        (async () => {
            if (!ExecutionEnvironment.canUseDOM) {
                return;
            }
            const targetElement =
                await getElement(`[data-target-id="${targetId}"]`);
            setElement(targetElement);
        })();
        return cleanUp;
    }, []);

    return element;
};
