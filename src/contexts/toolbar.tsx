import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as React from 'react';
import { ReactContextError } from './errors';

// TODO(dnguyen0304): Investigate changing to dynamic.
// TODO(dnguyen0304): Extract to config.
type ActiveWorkbenchId = 'read-time' | 'editor';

type WorkbenchIdToComponentType = ReadonlyMap<
    ActiveWorkbenchId,
    React.LazyExoticComponent<() => JSX.Element>
>;

const WORKBENCH_ID_TO_COMPONENT: WorkbenchIdToComponentType = new Map([
    [
        'read-time',
        React.lazy(() => import(
            '../theme/docupotamus-read-time/components/Workbench/ReadTime'
        )),
    ],
]);

interface ContextValue {
    readonly workbenchIdToComponent: WorkbenchIdToComponentType;
    readonly activeWorkbenchId: ActiveWorkbenchId | undefined;
    readonly workbenchIsOpen: boolean;
    readonly setActiveWorkbenchId: React.Dispatch<React.SetStateAction<
        ActiveWorkbenchId | undefined
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
            workbenchIdToComponent: WORKBENCH_ID_TO_COMPONENT,
            activeWorkbenchId,
            workbenchIsOpen,
            setActiveWorkbenchId,
            setWorkbenchIsOpen,
        }),
        [
            WORKBENCH_ID_TO_COMPONENT,
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
