import type { WrapperProps } from '@docusaurus/types';
import LayoutProviderInit from '@theme-init/Layout/Provider';
import type LayoutProviderType from '@theme/Layout/Provider';
import * as React from 'react';
import Decorator from '../../../decorators/Layout/Provider';

type Props = Readonly<WrapperProps<typeof LayoutProviderType>>;

export default function LayoutProviderWrapper(props: Props): JSX.Element {
    return (
        <Decorator>
            <LayoutProviderInit {...props} />
        </Decorator>
    );
};
