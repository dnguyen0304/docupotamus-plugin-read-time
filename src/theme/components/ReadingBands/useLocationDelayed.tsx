import { useLocation } from '@docusaurus/router';
import type { Location } from 'history';
import * as React from 'react';

export default function useLocationDelayed(
    delayMilli: number,
): Location | undefined {
    const location = useLocation<Location>();

    const timerId = React.useRef<number>();
    const [delayedLocation, setDelayedLocation] = React.useState<Location>();

    React.useEffect(() => {
        window.clearTimeout(timerId.current);
        timerId.current = window.setTimeout(() => {
            setDelayedLocation(location);
        }, delayMilli);
        return () => window.clearTimeout(timerId.current);
    }, [location]);

    return delayedLocation;
};
