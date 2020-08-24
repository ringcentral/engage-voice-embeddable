import gulp from 'gulp';
import path from 'path';
import yargs from 'yargs';
import fs from 'fs-extra';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import * as localeLoader from '@ringcentral-integration/locale-loader';
// import { supportedBrands } from './src/brands';
import getWebpackConfig from './src/lib/getWebpackConfig';

require('dotenv').config();

const rcSDKConfig = {
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
  server: process.env.RINGCENTRAL_SERVER,
};

const evAgentConfig = {
  localTesting: false,
  isSecureSocket: true,
  allowMultiSocket: true,
  authHost: process.env.ENGAGE_VOICE_AUTH_SERVER,
};

const authConfig = {
  redirectUri: process.env.AUTH_REDIRECT_URI,
};

const localeSettings = {
  supportedLocales: [
    'en-US',
    'en-GB',
    'en-AU',
    'fr-FR',
    'fr-CA',
    'de-DE',
    'it-IT',
    'es-ES',
    'es-419',
    'ja-JP',
    'pt-BR',
    'zh-CN',
    'zh-TW',
    'zh-HK',
  ],
  sourceLocale: 'en-US',
};

const environments = ['dev', 'prod'];

const { argv } = yargs
  .alias({
    hash: 'build-hash',
    env: 'build-type',
    exportType: 'export-type',
    hostingUrl: 'hosting-url',
  })
  .default('exportType', 'diff')
  .array('brand')
  .default('brand', ['rc'])
  .default('env', 'dev')
  .default('port', 8080)
  .coerce('env', (e) => (environments.indexOf(e) > -1 ? e : 'dev'));

const { env, buildHash, port, brand, exportType, hostingUrl } = argv;

const buildFolder = path.resolve(__dirname, './build');

function clean() {
  return Promise.all(
    brand.reduce(
      (all, brandName) => all.concat([fs.remove(path.resolve(buildFolder, brandName))]),
      [],
    ),
  );
}

function compile({ brandName = 'rc', buildPath }) {
  const config = getWebpackConfig({
    env,
    brand: brandName,
    buildPath,
    buildHash: env === 'prod' ? null : buildHash,
    hostingUrl,
    sdkConfig: rcSDKConfig,
    agentConfig: evAgentConfig,
    authConfig,
  });
  return new Promise((resolve, reject) => {
    webpack(config, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export async function build() {
  await clean();
  await Promise.all(
    brand.reduce((all, brandName) => all.concat([compile({
      brandName,
      buildPath: path.resolve(buildFolder, brandName)
    })]), []),
  );
}

export async function devServer() {
  const config = getWebpackConfig({
    env,
    brand: brand[0],
    buildPath: path.resolve(buildFolder, brand[0]),
    buildHash: null,
    hostingUrl: 'http://localhost:8080',
    sdkConfig: rcSDKConfig,
    agentConfig: evAgentConfig,
    authConfig,
  });
  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, {
    contentBase: __dirname,
    publicPath: '/',
    hot: true,
    inline: true,
    // noInfo: true,
    stats: {
      warnings: false,
      chunks: false,
      colors: true,
    },
  });
  server.listen(port);
  console.log(`Brand: ${brand}: server listening to ${port}...`);
}

/* Locale */
export async function exportLocale() {
  return localeLoader.exportLocale({
    ...localeSettings,
    exportType,
  });
}

export async function importLocale() {
  return localeLoader.importLocale(localeSettings);
}
