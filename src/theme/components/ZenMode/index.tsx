import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'grid',
    // Modal adds an empty "sentinel" element before and after the children.
    gridTemplateRows: '0 1fr 0',
    placeItems: 'center',
    '& .MuiBackdrop-root': {
        backgroundColor: theme.palette.background.paper,
    },
}));

const StyledBox = styled(Box)({
    // TODO(dnguyen0304): Fix missing responsive design.
    width: '60%',
    minHeight: '40%',
    borderRadius: '1rem',
    boxShadow: `
        5px 5px 10px 0 rgb(0 0 0 / 5%),
        10px 10px 20px 0 rgb(0 0 0 / 5%),
        20px 20px 40px 0 rgb(0 0 0 / 5%),
        40px 40px 80px 0 rgb(0 0 0 / 5%)`,
});

export default function ZenMode(): JSX.Element {
    // TODO(dnguyen0304): Remove development code.
    const [isOpen, setIsOpen] = React.useState<boolean>(true);

    return (
        <StyledModal
            onClose={() => setIsOpen(false)}
            open={isOpen}
            // Override the default Chrome outline behavior.
            // See: https://github.com/mui/material-ui/issues/11504#issuecomment-390506409
            disableAutoFocus
        >
            <StyledBox>
                {/* TODO(dnguyen0304): Remove development code. */}
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices ligula et augue lacinia, eu scelerisque justo consequat. Praesent mollis metus et aliquam accumsan. Phasellus at urna felis. Aliquam elementum lobortis nisi at bibendum. Cras tincidunt, urna sed aliquam mollis, velit eros feugiat ipsum, eget tincidunt ante est quis odio. Aenean et imperdiet risus, nec accumsan dolor. Phasellus massa mi, pulvinar id nunc vel, porta porta metus. Sed mi dolor, convallis eget vestibulum quis, facilisis ac leo. Curabitur dignissim consequat velit.</p>
                <p>Duis sed auctor magna. Maecenas consequat mi ac fringilla facilisis. Curabitur tempor sapien ac dignissim consequat. Sed pellentesque ligula tortor, sed ullamcorper velit auctor nec. Praesent congue nunc et risus pretium, eu convallis velit dignissim. Praesent nulla tortor, lobortis sit amet tellus vel, laoreet placerat nulla. Fusce vel magna id orci ullamcorper sodales. Phasellus sit amet maximus quam. Sed volutpat mattis nibh, eget auctor purus molestie eu.</p>
            </StyledBox>
        </StyledModal>
    );
};
