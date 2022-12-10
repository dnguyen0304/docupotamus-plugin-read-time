import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import { ReactContextError } from './errors';

interface ContextValue {
    readonly workbenchIsOpen: boolean;
    readonly setWorkbenchIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
    const {
        docupotamusReadTimePlugin: {
            workbenchIsOpen: workbenchIsOpenDefault,
        },
    } = useDocusaurusContext().siteConfig.themeConfig;

    const [workbenchIsOpen, setWorkbenchIsOpen] =
        React.useState<boolean>(workbenchIsOpenDefault);

    return React.useMemo(
        () => ({
            workbenchIsOpen,
            setWorkbenchIsOpen,
        }),
        [
            workbenchIsOpen,
            setWorkbenchIsOpen,
        ],
    );
};

interface Props {
    readonly children: React.ReactNode;
};

export function ToolbarProvider({ children }: Props): JSX.Element {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export function useToolbar(): ContextValue {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('ToolbarProvider');
    }
    return context;
};
