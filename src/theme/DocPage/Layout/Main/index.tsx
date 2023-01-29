import type { WrapperProps } from '@docusaurus/types';
import DocPageLayoutMainInit from '@theme-init/DocPage/Layout/Main';
import type DocPageLayoutMainType from '@theme/DocPage/Layout/Main';
import * as React from 'react';
import useReadTimeThemeConfig from '../../../docupotamus-read-time/hooks/useReadTimeThemeConfig';
import DocPageLayoutMainSwizzle from '../../../docupotamus-read-time/theme/DocPage/Layout/Main';

type Props = Readonly<WrapperProps<typeof DocPageLayoutMainType>>;

export default function DocPageLayoutMainWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useReadTimeThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <DocPageLayoutMainSwizzle {...props} />
            : <DocPageLayoutMainInit {...props} />
    );
};
