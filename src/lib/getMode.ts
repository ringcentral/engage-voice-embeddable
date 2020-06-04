export const getMode = () => {
  const mode = window.location.hash.replace('#mode=', '');
  return `sf-${mode}`;
};
