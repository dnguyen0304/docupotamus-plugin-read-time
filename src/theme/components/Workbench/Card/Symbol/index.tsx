import Box from '@mui/material/Box';
import * as React from 'react';

const SYMBOL_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SYMBOL_LENGTH = 3;

// TODO(dnguyen0304): Add real implementation for symbol ("stock ticker").
// Copied from: https://stackoverflow.com/a/1349426
const getSymbol = (length: number): string => {
    const characters = [];
    for (let i = 0; i < length; ++i) {
        const index = Math.floor(Math.random() * SYMBOL_CHARACTERS.length);
        characters.push(SYMBOL_CHARACTERS.charAt(index));
    }
    return characters.join('');
};

// This is currently unused.
// See: https://github.com/dnguyen0304/docusaurus-plugin-read-time/issues/4
export default function Symbol(): JSX.Element {
    const [symbol, setSymbol] = React.useState<string>('');

    React.useEffect(() => {
        setSymbol(getSymbol(SYMBOL_LENGTH));
    }, []);

    return <Box>{symbol}</Box>;
};
