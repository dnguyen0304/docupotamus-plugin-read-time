import {
    CARD_BOX_SHADOW_INNER_WIDTH_REM,
    CARD_BOX_SHADOW_OUTER_WIDTH_REM
} from './constants';

export const CardText = {
    color: '#fff',
    fontSize: 'var(--font-size--2)',
};

// TODO(dnguyen0304): Fix missing type declaration.
// TODO(dnguyen0304): Investigate why position: relative is a type error.
export const Card = {
    ...CardText,
    backgroundColor: 'rgb(48, 56, 70)',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    padding: 'var(--space-2xs)',
    '&:hover': {
        boxShadow: `
            #fff 0 0 0 ${CARD_BOX_SHADOW_INNER_WIDTH_REM}rem,
            rgb(100, 255, 218) 0 0 0 ${CARD_BOX_SHADOW_OUTER_WIDTH_REM}rem`,
    },
};
