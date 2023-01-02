import { RunningTotal, Target } from '@docusaurus/plugin-read-time';
import * as React from 'react';
import { ReactContextError } from './errors';

export interface RunningTotalSample {
    readonly target: Target;
    readonly runningTotal: RunningTotal;
};

export interface TargetIdToSamples {
    readonly [key: string]: RunningTotalSample;
};

// TODO(dnguyen0304): Investigate migrating to Map.
interface ContextValue {
    readonly targetIdToSamples: TargetIdToSamples;
    readonly setTargetIdToSamples: React.Dispatch<React.SetStateAction<
        TargetIdToSamples
    >>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const useContextValue = (): ContextValue => {
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
    readonly children: React.ReactNode;
};

export const SamplesProvider = ({ children }: Props): JSX.Element => {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export const useSamples = (): ContextValue => {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('SamplesProvider');
    }
    return context;
};
