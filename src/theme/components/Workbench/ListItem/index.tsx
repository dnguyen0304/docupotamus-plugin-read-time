import { styled } from '@mui/material/styles';
import {
    CARD_BOX_SHADOW_INNER_WIDTH_REM,
    CARD_BOX_SHADOW_OUTER_WIDTH_REM
} from '../constants';

export default styled('li')({
    position: 'relative',
    backgroundColor: 'rgb(48, 56, 70)',
    borderRadius: 'var(--border-radius)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 'var(--font-size--2)',
    padding: 'var(--space-2xs)',
    '&:hover': {
        boxShadow: `
            #fff 0 0 0 ${CARD_BOX_SHADOW_INNER_WIDTH_REM}rem,
            rgb(100, 255, 218) 0 0 0 ${CARD_BOX_SHADOW_OUTER_WIDTH_REM}rem`,
    },
});
