import type { WrapperProps } from '@docusaurus/types';
import Content from '@theme-init/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import * as React from 'react';
import ZenModeContent from '../../components/ZenMode/theme/DocItem/Content';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
    return (
        <ZenModeContent
            Content={Content}
            contentProps={props}
        />
    );
};
