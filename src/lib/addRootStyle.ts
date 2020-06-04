export const addRootStyle = (mode) => {
  const isClassic = mode === 'sf-classic';
  if (isClassic) {
    const style = document.createElement('style');
    style.innerText = `:root{font-size: 14px}`;
    document.body.appendChild(style);
  }
};
