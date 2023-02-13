import * as React from 'react';
import styles from './styles.module.css';

export default function useHighlight(
    element: Element | undefined,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const [isEnabled, setIsEnabled] = React.useState<boolean>(false);

    React.useEffect(() => {
        element?.classList?.remove(styles.target_container__highlight);
        if (isEnabled) {
            element?.classList?.add(styles.target_container__highlight);
        }
        return () => {
            element?.classList?.remove(styles.target_container__highlight);
        };
    }, [isEnabled]);

    return [isEnabled, setIsEnabled];
};
