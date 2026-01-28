import type { WebpackConfigOptions } from '@ringcentral-integration/next-builder';
import { getBaseWebpackConfig, merge } from './next/lib/webpack/builder.webpack';
import type { AppConfig } from './config';

export const getWebpackConfig = (options: WebpackConfigOptions<AppConfig>) => {
  const baseWebpackConfig = getBaseWebpackConfig(options);

  return merge(baseWebpackConfig, {
    // Add any custom webpack configuration here
  });
};
