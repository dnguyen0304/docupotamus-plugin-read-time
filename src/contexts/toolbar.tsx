import { TabConfig } from '@docusaurus/plugin-read-time';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import { ReactContextError } from './errors';

interface TabIdToConfig extends ReadonlyMap<
    string,
    Omit<TabConfig, 'tabId'>
> { };

// TODO(dnguyen0304): Add real implementation.
const keyByTabId = (tabConfigs: readonly TabConfig[]): TabIdToConfig => {
    return new Map(tabConfigs.map(tabConfig => [
        tabConfig.tabId,
        {
            modulePath: tabConfig.modulePath,
            // See: https://stackoverflow.com/a/47956054
            // See: https://stackoverflow.com/a/58350377
            // Component: React.lazy(() => import(tabConfig.modulePath)),
            Component: React.lazy(() => import(
                '@theme/docupotamus-read-time/components/Workbench/ReadTime'
            )),
        }
    ]));
};

interface ContextValue {
    readonly tabIdToConfig: TabIdToConfig;
    readonly activeTabId: string;
    readonly setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const useContextValue = (): ContextValue => {
    const {
        docupotamusReadTimePlugin: {
            tabs: tabConfigs,
            activeTabId: activeTabIdDefault,
        },
    } = useDocusaurusContext().siteConfig.themeConfig;

    const tabIdToConfig = keyByTabId(tabConfigs);

    if (activeTabIdDefault && !tabIdToConfig.has(activeTabIdDefault)) {
        throw new Error(
            `activeTabId not found in toolbar tabs - "${activeTabIdDefault}": `
            + `try checking your configuration`
        );
    }

    const [activeTabId, setActiveTabId] =
        React.useState<string>(activeTabIdDefault);

    return React.useMemo(
        () => ({
            tabIdToConfig,
            activeTabId,
            setActiveTabId,
        }),
        [
            tabIdToConfig,
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
