import * as React from 'react';
import styles from './styles.module.css';

export default function usePulse(
    element: Element | undefined,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const [isEnabled, setIsEnabled] = React.useState<boolean>(false);

    React.useEffect(() => {
        element?.classList?.remove(styles.target_container__pulse);
        if (isEnabled) {
            element?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
            element?.classList?.add(styles.target_container__pulse);
        }
        return () => element?.classList?.remove(styles.target_container__pulse);
    }, [isEnabled]);

    return [isEnabled, setIsEnabled];
};
