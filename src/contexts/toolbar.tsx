import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Investigate changing to dynamic.
// TODO(dnguyen0304): Extract to config.
type ActiveTabId = 'read-time' | 'editor';

type TabIdToComponentType = ReadonlyMap<
    ActiveTabId,
    React.LazyExoticComponent<() => JSX.Element>
>;

const TAB_ID_TO_COMPONENT: TabIdToComponentType = new Map([
    [
        'read-time',
        React.lazy(() => import(
            '../theme/docupotamus-read-time/components/Workbench/ReadTime'
        )),
    ],
]);

interface ContextValue {
    readonly tabIdToComponent: TabIdToComponentType;
    readonly activeTabId: ActiveTabId | undefined;
    readonly workbenchIsOpen: boolean;
    readonly setActiveTabId: React.Dispatch<React.SetStateAction<
        ActiveTabId | undefined
    >>;
    readonly setWorkbenchIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const useContextValue = (): ContextValue => {
    const firstTabId = [...TAB_ID_TO_COMPONENT.keys()][0];
    if (!firstTabId) {
        throw new Error('no toolbar tabs configured');
    }

    const {
        docupotamusReadTimePlugin: {
            workbenchIsOpen: workbenchIsOpenDefault,
        },
    } = useDocusaurusContext().siteConfig.themeConfig;

    const [activeTabId, setActiveTabId] =
        React.useState<ActiveTabId | undefined>(firstTabId);
    const [workbenchIsOpen, setWorkbenchIsOpen] =
        React.useState<boolean>(workbenchIsOpenDefault);

    return React.useMemo(
        () => ({
            tabIdToComponent: TAB_ID_TO_COMPONENT,
            activeTabId,
            workbenchIsOpen,
            setActiveTabId,
            setWorkbenchIsOpen,
        }),
        [
            TAB_ID_TO_COMPONENT,
            activeTabId,
            workbenchIsOpen,
            setActiveTabId,
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
