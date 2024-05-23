import webpack, { NormalModuleReplacementPlugin } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { getBaseWebpackConfig } from '@ringcentral-integration/widgets/lib/getBaseWebpackConfig';
import { getBrandConfig } from '../brands';
import * as packageConfig from '../../package.json';

const version = packageConfig.version;

function getWebpackConfig({
  brand,
  buildPath,
  buildHash,
  env = 'prod',
  hostingUrl,
  sdkConfig,
  agentConfig,
  authConfig,
}) {
  const brandConfig = getBrandConfig({ brand });
  const brandFolder = path.resolve(__dirname, `../brands/${brand}`);
  const environment = env === 'prod' ? 'production' : 'development';
  const base = getBaseWebpackConfig({
    mode: environment,
    themeFolder: brandFolder,
    babelLoaderExcludes: /node_modules|engage-voice-agent/
  });
  const scssLoader = base.module.rules.find((rule) => rule.test.test('x.scss'));
  // TODO: fix scss syntax error in widgets
  scssLoader.use.push({
    loader: 'string-replace-loader',
    options: {
      search: /and\(max-width/g, /// fix typo in scss
      replace: 'and (max-width',
    },
  });
  return {
    ...base,
    entry: {
      app: './src/app.tsx',
      redirect: './src/redirect.ts',
      adapter: './src/adapter.ts',
    },
    output: {
      path: buildPath,
      filename: '[name].js',
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(environment),
          API_CONFIG: JSON.stringify(sdkConfig),
          APP_VERSION: JSON.stringify(version),
          BRAND_CONFIG: JSON.stringify(brandConfig),
          AGENT_CONFIG: JSON.stringify(agentConfig),
          BUILD_HASH: JSON.stringify(buildHash),
          HOSTING_URL: JSON.stringify(hostingUrl),
          AUTH_CONFIG: JSON.stringify(authConfig),
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: './src/index.html', to: 'index.html' },
          { from: './src/redirect.html', to: 'redirect.html' },
          { from: './src/app.html', to: 'app.html' },
          { from: './src/favicon.ico', to: 'favicon.ico' },
          { from: './src/popup.html', to: 'popup.html' },
        ]
      }),
      new NormalModuleReplacementPlugin(
        /assets\/icons\/engageVoiceLogo\.svg/,
        path.resolve(__dirname, '../assets/ringCXLogo.svg'),
      ),
    ],
    resolve: {
      ...base.resolve,
      alias: {
        'brand-logo-path': brandFolder,
        '@SDK': path.resolve(__dirname, '../../vendor/agentLibrary.js'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    // optimization: {
    //   minimize: false,
    // },
  };
}

export default getWebpackConfig;
