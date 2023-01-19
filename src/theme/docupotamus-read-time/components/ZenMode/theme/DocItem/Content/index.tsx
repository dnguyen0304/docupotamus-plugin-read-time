// TODO(dnguyen0304): Extract integration for ZenMode component.
import type { KeyHandlers } from '@docusaurus/plugin-read-time';
import type { WrapperProps } from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type ContentType from '@theme/DocItem/Content';
import * as React from 'react';
import { HotKeys } from 'react-hotkeys';
import ZenMode from '../../../.';

interface Props {
    Content: React.ComponentClass;
    contentProps: WrapperProps<typeof ContentType>;
};

export default function ContentWrapper(
    {
        Content,
        contentProps,
    }: Props
): JSX.Element {
    const {
        debug: {
            zenModeIsEnabled,
        },
    } = useDocusaurusContext()
        .siteConfig
        .themeConfig
            .docupotamusReadTimePlugin;

    const [isOpen, setIsOpen] = React.useState<boolean>(zenModeIsEnabled);

    const handlers = React.useMemo((): KeyHandlers => ({
        ZEN_MODE: () => setIsOpen(true),
    }), []);

    return (
        <>
            {/* TODO(dnguyen0304): Move to a parent component for better
                  scope. */}
            <HotKeys handlers={handlers}>
                <Content {...contentProps} />
            </HotKeys>
            <ZenMode isOpen={isOpen} setIsOpen={setIsOpen}>
                {contentProps.children}
            </ZenMode>
        </>
    );
};
