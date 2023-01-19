import type { WrapperProps } from '@docusaurus/types';
import RootInit from '@theme-init/Root';
import type RootType from '@theme/Root';
import * as React from 'react';
import useReadTimeThemeConfig from '../docupotamus-read-time/hooks/useReadTimeThemeConfig';
import RootSwizzle from '../docupotamus-read-time/Root';

type Props = Readonly<WrapperProps<typeof RootType>>;

export default function RootWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useReadTimeThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <RootSwizzle {...props} />
            : <RootInit {...props} />
    );
};
