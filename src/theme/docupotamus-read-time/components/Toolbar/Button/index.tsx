import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import { useToolbar } from '../../../../../contexts/toolbar';

interface Props {
    readonly tabId: string;
};

export default function Button(
    {
        tabId,
    }: Props
): JSX.Element {
    const { setActiveTabId } = useToolbar();

    const handleClick = () => {
        setActiveTabId(prev => (prev === tabId) ? '' : tabId);
    };

    return (
        <IconButton onClick={handleClick}>
            <InsightsOutlinedIcon />
        </IconButton>
    );
};
