import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import type { KeyBinding } from '../../../docusaurus-theme-editor';

interface Props {
    readonly toggleEditorIsOpen: () => void;
}

export const EditButtonKeyBinding: KeyBinding = {
    key: 'e',
    friendlyLabel: 'e',
};

export default function EditButton(
    {
        toggleEditorIsOpen,
    }: Props
): JSX.Element {
    return (
        <Tooltip
            title={`Open editor panel (${EditButtonKeyBinding.friendlyLabel})`}
            placement='bottom'
        >
            <Button
                // TODO(dnguyen0304): Add product tour intro step.
                data-title='Be the change.'
                data-intro='Update and fix your docs live.'
                data-step={1}
                data-position='top'
                onClick={toggleEditorIsOpen}
                startIcon={<EditIcon />}
                variant='contained'
            >
                Edit
            </Button>
        </Tooltip>
    );
};