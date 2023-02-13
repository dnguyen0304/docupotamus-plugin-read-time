import * as React from 'react';

export default function useHasImproved(readTimeSecond: number): boolean {
    const originalReadTimeSecond = React.useRef<number>(readTimeSecond);
    const [hasImproved, setHasImproved] = React.useState<boolean>(false);

    React.useEffect(() => {
        setHasImproved(readTimeSecond > originalReadTimeSecond.current);
    }, [readTimeSecond]);

    return hasImproved;
};
