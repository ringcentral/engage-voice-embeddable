import rc from './rc';

const brandConfigs = {
  rc,
};

export const supportedBrands = Object.keys(brandConfigs);

export function getBrandConfig({ brand }) {
  const rawConfig = brandConfigs[brand];
  return rawConfig;
}
