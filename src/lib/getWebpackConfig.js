import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import getBaseConfig from 'ringcentral-widgets/lib/getWebpackConfig';
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
  const base = getBaseConfig({
    env: environment,
    themeFolder: brandFolder,
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
      new CopyWebpackPlugin([
        { from: './src/index.html', to: 'index.html' },
        { from: './src/redirect.html', to: 'redirect.html' },
        { from: './src/app.html', to: 'app.html' },
      ]),
    ],
    resolve: {
      ...base.resolve,
      alias: {
        'brand-logo-path': brandFolder,
        '@SDK': '@ringcentral-integration/engage-voice-widgets/lib/EvClient/__SDK__/agentLibrary.js',
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    // optimization: {
    //   minimize: false,
    // },
  };
}

export default getWebpackConfig;
