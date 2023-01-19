import type { WrapperProps } from '@docusaurus/types';
import ContentInit from '@theme-init/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import * as React from 'react';
import ContentSwizzle from '../../docupotamus-read-time/DocItem/Content';
import useReadTimeThemeConfig from '../../docupotamus-read-time/hooks/useReadTimeThemeConfig';

type Props = Readonly<WrapperProps<typeof ContentType>>;

export default function ContentWrapper(props: Props): JSX.Element {
    const { swizzleIsEnabled } = useReadTimeThemeConfig();

    return (
        (swizzleIsEnabled)
            ? <ContentSwizzle {...props} />
            : <ContentInit {...props} />
    );
};
