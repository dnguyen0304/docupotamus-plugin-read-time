import * as React from 'react';
import { RunningTotalSample } from '../docusaurus-plugin-read-time';
import { ReactContextError } from './errors';

export interface TargetIdToSamples {
    [key: string]: RunningTotalSample;
};

// TODO(dnguyen0304): Investigate migrating to Map.
interface ContextValue {
    readonly targetIdToSamples: TargetIdToSamples;
    readonly setTargetIdToSamples: React.Dispatch<React.SetStateAction<
        TargetIdToSamples
    >>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const [targetIdToSamples, setTargetIdToSamples] =
        React.useState<TargetIdToSamples>({});

    return React.useMemo(
        () => ({
            targetIdToSamples,
            setTargetIdToSamples,
        }),
        [
            targetIdToSamples,
            setTargetIdToSamples,
        ],
    );
};

interface Props {
    children: React.ReactNode;
};

export function SamplesProvider({ children }: Props): JSX.Element {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export function useSamples(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('SamplesProvider');
    }
    return context;
};
