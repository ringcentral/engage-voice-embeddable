import path from 'path';
import type { WebpackConfigOptions } from '@ringcentral-integration/next-builder';
import { DefinePlugin, type RuleSetRule } from 'webpack';
import { getBaseWebpackConfig, merge } from './src/lib/webpack/builder.webpack';
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
  const { projectConfig } = options;
  const scriptingRenderAsset = projectConfig.assetsEntries?.find(
    ({ to }) => to === 'scriptingRender.js',
  );

  // The renderer is a prebuilt bundle loaded directly by agentScript.html.
  // Mark it as minimized so Webpack copies it without processing it again.
  if (scriptingRenderAsset) {
    Object.assign(scriptingRenderAsset, { info: { minimized: true } });
  }

  const baseWebpackConfig = getBaseWebpackConfig(options);

  return merge(baseWebpackConfig, {
    module: {
      rules: getCustomRules(),
    },
    plugins: [
      new DefinePlugin({
        // Adapter entry uses these env vars for building the app URL
        'process.env.HOSTING_URL': JSON.stringify(
          process.env.HOSTING_URL || '.',
        ),
        'process.env.APP_VERSION': JSON.stringify(
          projectConfig.appConfig.version.appVersion || '',
        ),
      }),
    ],
    resolve: {
      alias: {
        // Brand logo path alias for dynamic brand theming
        'brand-logo-path': projectConfig.themePath,
        // No '@SDK' alias: the agent library is loaded as a global by app.html
        // (window.AgentSDK, served from src/agentLibrary.js). The old alias
        // pointed at a stale vendor/ copy that nothing imported.
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
