import DoneIcon from '@mui/icons-material/Done';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSnackbar } from '../../../../../contexts/snackbar';
import type { KeyBinding as KeyBindingType } from '../../../../../docusaurus-theme-editor';

interface Props {
    readonly isSaving: boolean;
    readonly onClick: () => void;
    readonly setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
}

const KeyBinding: KeyBindingType = {
    key: 'shift+option+s',
    friendlyLabel: '^⌥S',
};

export default function SaveButton(
    {
        isSaving,
        onClick,
        setIsSaving,
    }: Props
): JSX.Element {
    const snackbar = useSnackbar().snackbar;
    const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);
    const timerId = React.useRef<number>();

    // TODO(dnguyen0304): Investigate if a real implementation is necessary in
    // addition to background saving.
    const handleClick = () => {
        setIsSaving(true);
        new Promise(resolve => setTimeout(resolve, 750))
            .then(() => {
                setIsSaving(false);
                setIsConfirmed(true);
                snackbar.sendSuccessAlert('Successfully saved changes.');
            })
            .then(() => {
                timerId.current = window.setTimeout(() => {
                    setIsConfirmed(false);
                }, 1250);
            });
    };

    const getIcon = (): JSX.Element => {
        if (isConfirmed) {
            return <DoneIcon color='primary' />;
        } else if (isSaving) {
            // All components must have the same dimensions (size) to avoid
            // visual studdering.
            return <CircularProgress size={24} />;
        } else {
            return <SaveOutlinedIcon />;
        };
    };

    useHotkeys(
        KeyBinding.key,
        handleClick,
    );

    React.useEffect(() => {
        return () => {
            clearTimeout(timerId.current);
        };
    }, []);

    return (
        <Tooltip
            title={`Save (${KeyBinding.friendlyLabel})`}
            placement='top'
        >
            <IconButton
                aria-label='save'
                onClick={handleClick}
            >
                {getIcon()}
            </IconButton>
        </Tooltip>
    );
}
