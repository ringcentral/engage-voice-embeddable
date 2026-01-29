import path from 'path';
import type { WebpackConfigOptions } from '@ringcentral-integration/next-builder';
import type { RuleSetRule } from 'webpack';
import { getBaseWebpackConfig, merge } from './next/lib/webpack/builder.webpack';
import type { AppConfig } from './config';

const getCustomRules = (): RuleSetRule[] => [
  // Fix scss syntax error in widgets: `and(max-width` → `and (max-width`
  {
    test: /\.scss$/,
    enforce: 'pre',
    use: {
      loader: 'string-replace-loader',
      options: {
        search: /and\(max-width/g,
        replace: 'and (max-width',
      },
    },
  },
  // agentLibrary.js: Replace window.location.origin with window.evAuthHost
  // type: javascript/auto ensures CommonJS module.exports works with default import
  {
    test: /agentLibrary\.js$/,
    type: 'javascript/auto',
    use: {
      loader: 'string-replace-loader',
      options: {
        search: 'window.location.origin',
        replace: 'window.evAuthHost',
      },
    },
  },
];

export const getWebpackConfig = (options: WebpackConfigOptions<AppConfig>) => {
  const baseWebpackConfig = getBaseWebpackConfig(options);
  const { projectConfig } = options;

  return merge(baseWebpackConfig, {
    module: {
      rules: getCustomRules(),
    },
    resolve: {
      alias: {
        // Brand logo path alias for dynamic brand theming
        'brand-logo-path': projectConfig.themePath,
        // Agent SDK alias - CommonJS module from vendor folder
        '@SDK': path.resolve(__dirname, './vendor/agentLibrary.js'),
        // Fix @ringcentral/juno path resolution issue
        // The package exports maps ./* to ./es6/*, so es6/ prefix in imports causes double path
        '@ringcentral/juno/es6': path.resolve(
          __dirname,
          './node_modules/@ringcentral/juno/es6',
        ),
        // Same fix for juno-icon
        '@ringcentral/juno-icon/es6': path.resolve(
          __dirname,
          './node_modules/@ringcentral/juno-icon/es6',
        ),
      },
    },
  });
};
