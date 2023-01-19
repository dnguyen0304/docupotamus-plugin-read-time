import type { WrapperProps } from '@docusaurus/types';
import DocPageLayoutMainInit from '@theme-init/DocPage/Layout/Main';
import type DocPageLayoutMainType from '@theme/DocPage/Layout/Main';
import * as React from 'react';
import DocPageLayoutMainSwizzle from '../../../docupotamus-read-time/DocPage/Layout/Main';
import useReadTimeThemeConfig from '../../../docupotamus-read-time/hooks/useReadTimeThemeConfig';

type Props = Readonly<WrapperProps<typeof DocPageLayoutMainType>>;

export default function DocPageLayoutMainWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useReadTimeThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <DocPageLayoutMainSwizzle {...props} />
            : <DocPageLayoutMainInit {...props} />
    );
};
