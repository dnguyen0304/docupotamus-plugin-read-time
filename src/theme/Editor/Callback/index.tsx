import { Redirect } from '@docusaurus/router';
import * as React from 'react';
import URI from 'urijs';
import { useContentDocs } from '../../../contexts/contentDocs';
import { useGithub } from '../../../contexts/github';
import { authenticate, parseCallbackUrl } from '../../services/Github';

export default function Callback(): JSX.Element | null {
    const { path: docsPath } = useContentDocs();
    const { user, setUser, setApi } = useGithub();

    const [redirectPath, setRedirectPath] = React.useState<string>('');

    React.useEffect(() => {
        const doAuthenticate = async () => {
            const {
                authorizationCode,
                redirectPath,
            } = parseCallbackUrl(new URI());
            const {
                user,
                api,
            } = await authenticate(authorizationCode, docsPath);

            setUser(user);
            setApi(api);
            setRedirectPath(redirectPath);
        };
        doAuthenticate();
    }, []);

    return (
        user
            ? <Redirect to={redirectPath} />
            // TODO(dnguyen0304): Add page for "Please wait while you are being
            // redirected" to improve the UX.
            : null
    );
}
