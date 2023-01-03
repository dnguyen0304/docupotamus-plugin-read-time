import * as React from 'react';
import { ReactContextError } from './errors';

interface ContextValue {
    readonly minRank: number;
    readonly minScore: number;
    readonly setMinRank: React.Dispatch<React.SetStateAction<number>>;
    readonly setMinScore: React.Dispatch<React.SetStateAction<number>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const useContextValue = (): ContextValue => {
    // The 100th percentile always exists even if it isn't visible to the user.
    const [minRank, setMinRank] = React.useState<number>(100);
    const [minScore, setMinScore] = React.useState<number>(0);

    return React.useMemo(
        () => ({
            minRank,
            minScore,
            setMinRank,
            setMinScore,
        }),
        [
            minRank,
            minScore,
            setMinRank,
            setMinScore,
        ],
    );
};

interface Props {
    readonly children: React.ReactNode;
};

export const PercentileProvider = ({ children }: Props): JSX.Element => {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export const usePercentile = (): ContextValue => {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('PercentileProvider');
    }
    return context;
};
