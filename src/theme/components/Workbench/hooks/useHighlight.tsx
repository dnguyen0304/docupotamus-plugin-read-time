import * as React from 'react';
import styles from './styles.module.css';
import useElement from './useElement';

export default function useHighlight(
    targetId: string,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const element = useElement(
        targetId,
        () => element?.classList.remove(styles.target_container__highlight),
    );
    const [isEnabled, setIsEnabled] = React.useState<boolean>(false);

    React.useEffect(() => {
        element?.classList.remove(styles.target_container__highlight);
        if (isEnabled) {
            element?.classList.add(styles.target_container__highlight);
        }
    }, [isEnabled]);

    return [isEnabled, setIsEnabled];
};
