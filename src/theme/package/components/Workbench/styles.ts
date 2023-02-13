export const CardText = {
    color: '#fff',
    fontSize: 'var(--font-size--2)',
};

// TODO(dnguyen0304): Investigate migrating from px to em units to scale with
// font-size.
// TODO(dnguyen0304): Fix missing type declaration.
// TODO(dnguyen0304): Investigate why position: relative is a type error.
export const Card = {
    ...CardText,
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    padding: 'var(--space-2xs)',
};
