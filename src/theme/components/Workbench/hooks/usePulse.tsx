import * as React from 'react';
import styles from './styles.module.css';
import useElement from './useElement';

export default function useFlicker(
    targetId: string,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const element = useElement(targetId);
    const [isEnabled, setIsEnabled] = React.useState<boolean>(false);

    React.useEffect(() => {
        element?.classList.remove(styles.target_container__flicker);
        if (isEnabled) {
            element?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
            element?.classList.add(styles.target_container__flicker);
        }
    }, [isEnabled]);

    return [isEnabled, setIsEnabled];
};
