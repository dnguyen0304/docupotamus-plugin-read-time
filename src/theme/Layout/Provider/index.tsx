import type { WrapperProps } from '@docusaurus/types';
import LayoutProviderInit from '@theme-init/Layout/Provider';
import type LayoutProviderType from '@theme/Layout/Provider';
import * as React from 'react';
import useReadTimeThemeConfig from '../../docupotamus-read-time/hooks/useReadTimeThemeConfig';
import LayoutProviderSwizzle from '../../docupotamus-read-time/theme/Layout/Provider';

type Props = Readonly<WrapperProps<typeof LayoutProviderType>>;

export default function LayoutProviderWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useReadTimeThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <LayoutProviderSwizzle {...props} />
            : <LayoutProviderInit {...props} />
    );
};
