import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import { ReactContextError } from './errors';

type TabIdToComponentType = ReadonlyMap<
    string,
    React.LazyExoticComponent<() => JSX.Element>
>;

const TAB_ID_TO_COMPONENT: TabIdToComponentType = new Map([
    [
        'read-time',
        React.lazy(() => import(
            '@theme/docupotamus-read-time/components/Workbench/ReadTime'
        )),
    ],
]);

interface ContextValue {
    readonly tabIdToComponent: TabIdToComponentType;
    readonly activeTabId: string;
    readonly setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const useContextValue = (): ContextValue => {
    const {
        docupotamusReadTimePlugin: {
            activeTabId: activeTabIdDefault,
        },
    } = useDocusaurusContext().siteConfig.themeConfig;

    if (activeTabIdDefault && !TAB_ID_TO_COMPONENT.has(activeTabIdDefault)) {
        throw new Error(
            `activeTabId not found in toolbar tabs - "${activeTabIdDefault}": `
            + `try checking your configuration`
        );
    }

    const [activeTabId, setActiveTabId] =
        React.useState<string>(activeTabIdDefault);

    return React.useMemo(
        () => ({
            tabIdToComponent: TAB_ID_TO_COMPONENT,
            activeTabId,
            setActiveTabId,
        }),
        [
            TAB_ID_TO_COMPONENT,
            activeTabId,
            setActiveTabId,
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
