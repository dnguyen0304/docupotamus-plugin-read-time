import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import * as React from 'react';
import { DATA_ATTRIBUTE_TARGET_ID } from '../../../../constants';
import { getElement } from '../../../../services/dom';

export default function useElement(targetId: string): Element | undefined {
    const [element, setElement] = React.useState<Element>();

    React.useEffect(() => {
        (async () => {
            if (!ExecutionEnvironment.canUseDOM) {
                return;
            }
            const targetElement =
                await getElement(`[${DATA_ATTRIBUTE_TARGET_ID}="${targetId}"]`);
            setElement(targetElement);
        })();
    }, []);

    return element;
};
