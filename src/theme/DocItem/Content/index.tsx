// TODO(dnguyen0304): Extract integration for ZenMode component.
import type { KeyHandlers } from '@docusaurus/plugin-read-time';
import type { WrapperProps } from '@docusaurus/types';
import Content from '@theme-init/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import * as React from 'react';
import { HotKeys } from 'react-hotkeys';
import ZenMode from '../../components/ZenMode';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const handlers = React.useMemo((): KeyHandlers => ({
        ZEN_MODE: () => setIsOpen(true),
    }), []);

    return (
        <>
            {/* TODO(dnguyen0304): Move to a parent component for better
                  scope. */}
            <HotKeys handlers={handlers}>
                <Content {...props} />
            </HotKeys>
            <ZenMode isOpen={isOpen} setIsOpen={setIsOpen}>
                {props.children}
            </ZenMode>
        </>
    );
};
