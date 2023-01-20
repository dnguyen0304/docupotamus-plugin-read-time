import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Button from './Button';

// TODO(dnguyen0304): Add paddingRight for the scrollbar.
const StyledBox = styled(Box)({
    position: 'sticky',
    top: 'var(--ifm-navbar-height)',
    // TODO(dnguyen0304): Fix missing responsive layout.
    width: '110px',
    height: 'calc(100vh - var(--ifm-navbar-height))',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderLeft: '1px solid var(--ifm-toc-border-color)',
    paddingTop: 'var(--space-s)',
});

export default function Toolbar(): JSX.Element {
    return (
        <StyledBox>
            {/* TODO(dnguyen0304): Fix magic string. */}
            <Button tabId='read-time'>
                <InsightsOutlinedIcon />
            </Button>
        </StyledBox>
    );
};
