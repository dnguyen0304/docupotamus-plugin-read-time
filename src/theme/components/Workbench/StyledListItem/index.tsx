import { styled } from '@mui/material/styles';
import {
    CARD_BOX_SHADOW_INNER_WIDTH_REM,
    CARD_BOX_SHADOW_OUTER_WIDTH_REM
} from '../constants';

const BOX_SHADOW_WIDTH_REM: number =
    CARD_BOX_SHADOW_INNER_WIDTH_REM + CARD_BOX_SHADOW_OUTER_WIDTH_REM;

export default styled('li')({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgb(48, 56, 70)',
    borderRadius: 'var(--border-radius)',
    color: '#fff',
    fontSize: 'var(--font-size--2)',
    margin: `${BOX_SHADOW_WIDTH_REM}rem`,
    // TODO(dnguyen0304): Investigate decreasing to have vertical symmetry with
    // Workbench padding-left style.
    marginRight: `calc(`
        + `${BOX_SHADOW_WIDTH_REM}rem`
        + ` + `
        + `var(--space-xs))`,
    padding: 'var(--space-2xs)',
    '&:hover': {
        boxShadow: `
            #fff 0 0 0 ${CARD_BOX_SHADOW_INNER_WIDTH_REM}rem,
            rgb(100, 255, 218) 0 0 0 ${CARD_BOX_SHADOW_OUTER_WIDTH_REM}rem`,
    },
});
