import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Investigate changing to dynamic.
// TODO(dnguyen0304): Extract to config.
type ActiveWorkbenchId = 'read-time' | 'editor' | undefined;

interface ContextValue {
    readonly activeWorkbenchId: ActiveWorkbenchId;
    readonly workbenchIsOpen: boolean;
    readonly setActiveWorkbenchId: React.Dispatch<React.SetStateAction<
        ActiveWorkbenchId
    >>;
    readonly setWorkbenchIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const useContextValue = (): ContextValue => {
    const {
        docupotamusReadTimePlugin: {
            workbenchIsOpen: workbenchIsOpenDefault,
        },
    } = useDocusaurusContext().siteConfig.themeConfig;

    const [activeWorkbenchId, setActiveWorkbenchId] =
        React.useState<ActiveWorkbenchId>();
    const [workbenchIsOpen, setWorkbenchIsOpen] =
        React.useState<boolean>(workbenchIsOpenDefault);

    return React.useMemo(
        () => ({
            activeWorkbenchId,
            workbenchIsOpen,
            setActiveWorkbenchId,
            setWorkbenchIsOpen,
        }),
        [
            activeWorkbenchId,
            workbenchIsOpen,
            setActiveWorkbenchId,
            setWorkbenchIsOpen,
        ],
    );
};

interface Props {
    readonly children: React.ReactNode;
};

export const ToolbarProvider = ({ children }: Props): JSX.Element => {
    const value = useContextValue();

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export const useToolbar = (): ContextValue => {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new ReactContextError('ToolbarProvider');
    }
    return context;
};
