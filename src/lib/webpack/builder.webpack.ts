import { processI18n } from '@ringcentral-integration/i18n/lib/processI18n';
import type { BaseAppConfig } from '@ringcentral-integration/next-integration/interfaces';
import { getArgs } from '@ringcentral-integration/next-integration/lib/getArgs';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import template from 'lodash/template';
import path from 'path';
import * as nodeUrl from 'url';
import { type Chunk, DefinePlugin, ProvidePlugin } from 'webpack';
import { merge } from 'webpack-merge';

import { getPrimaryColor } from '@ringcentral-integration/next-builder/src/getPrimaryColor';
import type { ProjectConfig } from '@ringcentral-integration/next-builder/src/getProjectConfig';
import { getLoadWorkerTemplate } from '@ringcentral-integration/next-builder/src/scriptsLoadFail/getLoadWorkerTemplate';
import { getScriptsLoadFailTemplate } from '@ringcentral-integration/next-builder/src/scriptsLoadFail/getScriptsLoadFailTemplate';
import { getThemeInjectTemplate } from '@ringcentral-integration/next-builder/src/themeInject/getThemeInjectTemplate';
export { merge } from 'webpack-merge';
import { getBaseWebpackConfig as getWebpackConfig } from './widgets.webpack';

const DEFAULT_FILENAME = '[name].js';
const DEFAULT_CHUNK_FILENAME = '[name].js';
/**
 * Per-build output folder for every chunk that takes part in the webpack module
 * registry.
 *
 * Chunk filenames carry no content hash (`enableHash: false` below), so each
 * deploy overwrites them in place at the same CDN URLs. When a browser or a CDN
 * edge then serves a mix of files from two builds, the runtime looks up a module
 * id that was never registered and throws
 * `Cannot read properties of undefined (reading 'call')`.
 *
 * Emitting each build into its own folder makes those URLs immutable, so a
 * cached `app.html` keeps loading the exact build it was generated against.
 *
 * `[fullhash]` covers the whole compilation, so an unchanged rebuild reuses the
 * same folder and a redeploy adds nothing new.
 *
 * Chunks reference each other through this folder (`publicPath` is empty, so the
 * folder is part of every chunk URL). That resolves correctly for anything the
 * document loads, but `importScripts` in a worker resolves against the worker
 * script's own directory — a worker placed inside the folder would request
 * `<hash>/<hash>/zh-CN.js`. The worker is therefore pinned to the output root
 * via `chunkFilenames` in project.config.json.
 */
const args = getArgs();

/**
 * Resolved once, at config time, so it is a literal path segment.
 *
 * It deliberately does NOT use webpack's `[fullhash]`: webpack only injects the
 * `__webpack_require__.h` runtime module when it can statically see that
 * placeholder, and `output.chunkFilename` here is a function. The placeholder
 * still compiles to `h().slice(0, 8)` inside the chunk-URL helper, so the bundle
 * builds cleanly and then dies at runtime with `h is not a function` before it
 * can load a single chunk.
 *
 * Defaults to the build's UTC timestamp: unique per build, so a folder is never
 * reused (two builds of the same commit can differ if dependencies drift), and
 * lexicographically sortable, so pruning old folders off the CDN is just a sort.
 *
 * Pass `--build-hash` to override it with a pipeline id or release tag.
 */
const getBuildId = (): string => {
  if (args.buildHash) return String(args.buildHash);

  // 2026-09-02T07:15:23.456Z -> 20260902-071523456
  return new Date()
    .toISOString()
    .replace(/[-:.]/g, '')
    .replace('T', '-')
    .replace('Z', '');
};

const BUILD_DIR = getBuildId();
/**
 * `[buildid]` in a `chunkFilenames` entry expands to the build id.
 *
 * Used to keep the shared worker at the deploy root while still making it
 * immutable per build. It cannot live in BUILD_DIR: framework code resolves the
 * app's base URL from the worker's own `location.href` (OAuthBase's
 * `redirectUri`, `getHostPath()`), so a worker one directory down resolves
 * `./redirect.html` to `HOST/<build>/redirect.html`.
 */
const applyBuildId = (filename: string) =>
  filename.replace(/\[buildid\]/g, BUILD_DIR);
const HASHED_FILENAME = `${BUILD_DIR}/${DEFAULT_FILENAME}`;
const HASHED_CHUNK_FILENAME = `${BUILD_DIR}/${DEFAULT_CHUNK_FILENAME}`;
/**
 * default vendor chunk name
 */
const VENDOR_KEY = 'vendor';
/**
 * Chunk name of the shared worker, set by the `webpackChunkName` magic comment
 * in app.ts.
 */
const WORKER_KEY = 'worker';

export interface WebpackConfigOptions<T extends BaseAppConfig> {
  projectConfig: ProjectConfig<T>;
  devServer?: boolean;
  analyzeBundle?: boolean;
  templateParameters?: HtmlWebpackPlugin.Options['templateParameters'];
  /**
   * if you need always output as prod mode, you can set this option, that will make your output file always use prod mode(code still be development)
   *
   * that will be useful when you need to debug service worker
   */
  outputAlwaysUseProdFileName?: boolean;
  publicPath?: string;
  /**
   * block pendo remote js code, so 'pendo.js' will not be loaded. False by default
   */
  blockPendoSourceCode?: boolean;
  /**
   * block analytics remote js code, so 'analytics.min.js' will not be loaded. False by default
   */
  blockSegmentSourceCode?: boolean;
}

export const getFinalFilePathMap = <T extends BaseAppConfig>(
  projectConfig: ProjectConfig<T>,
) => {
  const filenameMap = projectConfig.projectConfig.pages.reduce(
    (acc, { main, index, filename }) => {
      const chunkName = path.parse(main).name;
      // Pages with an explicit `filename` (adapter.js, agentScript.js) are
      // embedded by consumers at a fixed URL and stay at the output root.
      acc[chunkName] = filename ?? HASHED_FILENAME;

      return acc;
    },
    {} as Record<string, string>,
  );

  return filenameMap;
};


export const getBaseWebpackConfig = <T extends BaseAppConfig>({
  projectConfig,
  devServer,
  analyzeBundle = !!args.analyze,
  templateParameters,
  outputAlwaysUseProdFileName,
  publicPath,
  blockSegmentSourceCode = false,
  blockPendoSourceCode = false,
}: WebpackConfigOptions<T>) => {
  const {
    mode,
    appConfig,
    themeSystem = 'juno',
    runtimeEnvironment = 'web',
  } = projectConfig;
  const defaultLocale = appConfig.brandConfig.defaultLocale ?? 'en-US';

  const customEntryUrl = fs
    .readFileSync(path.join(__dirname, '../../../node_modules/@ringcentral-integration/next-builder/src/templates/customEntryUrl.js'))
    .toString();

  const loading = fs
    .readFileSync(path.join(__dirname, '../../../node_modules/@ringcentral-integration/next-builder/src/templates/loading.html'))
    .toString();

  const loadingSpring = fs
    .readFileSync(path.join(__dirname, '../../../node_modules/@ringcentral-integration/next-builder/src/templates/loading-spring.html'))
    .toString();

  const meta = fs
    .readFileSync(path.join(__dirname, '../../../node_modules/@ringcentral-integration/next-builder/src/templates/meta.html'))
    .toString();

  const isExtension = runtimeEnvironment === 'extension';
  const font = fs
    .readFileSync(
      path.join(
        __dirname,
        isExtension ? '../../../node_modules/@ringcentral-integration/next-builder/src/templates/font-extension.html' : '../../../node_modules/@ringcentral-integration/next-builder/src/templates/font.html',
      ),
    )
    .toString();

  const fontSpring = fs
    .readFileSync(
      path.join(
        __dirname,
        isExtension
          ? '../../../node_modules/@ringcentral-integration/next-builder/src/templates/font-spring-extension.html'
          : '../../../node_modules/@ringcentral-integration/next-builder/src/templates/font-spring.html',
      ),
    )
    .toString();

  const primaryColor = template(
    fs
      .readFileSync(path.join(__dirname, '../../../node_modules/@ringcentral-integration/next-builder/src/templates/primary-color.html'))
      .toString(),
  )({
    primaryColor: getPrimaryColor(appConfig.brandConfig).foreground,
  });

  const preferredDevtool = (() => {
    if (isExtension)
      return (
        projectConfig.preferredDevtool ||
        // in development mode, use inline-source-map, content script not able to load .map file,
        // in production mode, use source-map for separate source map file adn upload to sentry
        (mode === 'development' ? 'inline-source-map' : 'source-map')
      );

    return projectConfig.preferredDevtool;
  })();

  const chunkLocale = (() => {
    return isExtension
      ? // not chunk i18n files, because we need to load all i18n files in content script, and also chrome extension not need lazy load
        false
      : (local: string) => {
          return local !== defaultLocale;
        };
  })();

  // Ensure themePath is absolute
  const themeFolder = path.isAbsolute(projectConfig.themePath)
    ? projectConfig.themePath
    : path.resolve(process.cwd(), projectConfig.themePath);

  const baseConfig = getWebpackConfig({
    mode,
    useThreadLoader: true,
    themeFolder,
    supportedLocales: projectConfig.appConfig.brandConfig
      .supportedLocales as string[],
    useDevtool: projectConfig.useDevtool,
    preferredDevtool,
    analyzeBundle,
    chunkLocale,
    useStyleTransform: projectConfig.useStyleTransform,
    hashPrefix: projectConfig.appConfig.hashPrefix,
    enableHash: false,
    env: args.buildEnv,
  });

  const isProd = projectConfig.mode === 'production';
  const getWorkerFilename = () => {
    // Development output is flat, so the worker keeps its plain chunk name.
    if (!(isProd || outputAlwaysUseProdFileName)) return 'worker.js';

    const configured = projectConfig.projectConfig.chunkFilenames;
    const template =
      (typeof configured === 'string' ? configured : configured?.[WORKER_KEY]) ??
      HASHED_CHUNK_FILENAME;

    return applyBuildId(template).replace('[name]', WORKER_KEY);
  };
  // In MFE mode, exported files are typically split separately.
  const outputUsePropsMode = isProd || outputAlwaysUseProdFileName;

  const developmentConfig = merge(baseConfig, {
    entry: { ...projectConfig.mainEntries },
    output: {
      path: path.join(
        projectConfig.buildPath,
        projectConfig.appConfig.brandConfig.code,
      ),
      filename: DEFAULT_FILENAME,
      clean: true,
      publicPath: publicPath ?? 'auto',
    },
    plugins: [
      // TODO: use @babel/plugin-transform-react-jsx
      new ProvidePlugin({
        React: 'react',
      }),
      ...(projectConfig.assetsEntries?.length
        ? [
            new CopyWebpackPlugin({
              patterns: projectConfig.assetsEntries,
            }),
          ]
        : []),
      new DefinePlugin({
        // TODO: processDefaultDarkAndHighContactTheme
        'process.env.APP_CONFIG': JSON.stringify(appConfig),
        'process.env.THEME_SYSTEM': JSON.stringify(themeSystem),
        /**
         * The file the worker chunk is emitted as, relative to the page.
         *
         * app.ts builds the SharedWorker URL from this so it can append the
         * page's query params; it must therefore match what `output.chunkFilename`
         * produces for the `worker` chunk, which is why it is read from the same
         * `chunkFilenames` config rather than spelled out a second time.
         */
        'process.env.WORKER_URL': JSON.stringify(getWorkerFilename()),
        'process.env.BLOCK_PENDO_SOURCE_CODE':
          JSON.stringify(blockPendoSourceCode),
        'process.env.BLOCK_SEGMENT_SOURCE_CODE': JSON.stringify(
          blockSegmentSourceCode,
        ),
      }),
      ...projectConfig.projectConfig.pages
        .filter((x) => !!x.index)
        .map(({ index, params, main }) => {
          const mainChunk = path.parse(main).name;

          return new HtmlWebpackPlugin({
            filename: path.basename(index!),
            template: index,
            chunks: [mainChunk],
            ...params,
            templateParameters: (compilation, assets, assetTags, options) => {
              // Resolve chunk names against the filenames webpack actually
              // emitted. Matching on `AssetInfo` hashes does not work here:
              // `[fullhash]` is compilation-wide, so every asset reports the
              // same hash and every chunk name resolves to the first one.
              const fileUrlMap = new Map<string, string>();
              compilation.chunks.forEach((chunk) => {
                if (!chunk.name) return;
                const file = Array.from(chunk.files).find((name) =>
                  name.endsWith('.js'),
                );
                if (file) fileUrlMap.set(chunk.name, file);
              });
              const compilationHash = compilation.hash ?? '';
              const workerVersionQuery = compilationHash
                ? `?_v=${compilationHash}`
                : '';

              const getChunkUrl = (chunkName: string) => {
                if (!outputUsePropsMode) return `${chunkName}.js`;

                const url = fileUrlMap?.get(chunkName);
                if (!url) return `${chunkName}.js`;

                return nodeUrl.resolve(publicPath ?? '', url);
              };

              const workerScript = (
                nameSpace = '__rc_shared_worker__',
                chunkName = 'worker',
                queryString = workerVersionQuery,
              ): string => {
                const workerUrl = `${getChunkUrl(chunkName)}${queryString}`;
                const mfeConfig =
                  // TODO: fix type
                  //@ts-ignore
                  projectConfig.appConfig.mfeConfig;
                const baseScript = getLoadWorkerTemplate(
                  nameSpace,
                  workerUrl,
                  chunkName,
                  mfeConfig ? JSON.stringify(mfeConfig) : '',
                );
                // Append stable page query params to the worker URL at runtime
                // so the worker can read them via self.location.search.
                // Uses a regex to match regardless of indentation in the template.
                // Filters out volatile/page-only params (_t, fromAdapter, fromPopup)
                // so the worker URL stays stable across reloads with the same config.
                const sep = workerUrl.includes('?') ? '&' : '?';
                return baseScript.replace(
                  /const url = '[^']*';/,
                  `const url = (function() {
                    var base = '${workerUrl}';
                    var p = new URLSearchParams(window.location.search);
                    ['_t', 'fromAdapter', 'fromPopup'].forEach(function(k) { p.delete(k); });
                    var s = p.toString();
                    return s ? base + '${sep}' + s : base;
                  })();`,
                );
              };

              const formattedBrandConfig = processI18n<
                BaseAppConfig['brandConfig']
              >(projectConfig.appConfig.brandConfig, defaultLocale);
              const { appName } = formattedBrandConfig;

              return {
                // #region default templateParameters
                compilation: compilation,
                webpackConfig: compilation.options,
                htmlWebpackPlugin: {
                  tags: assetTags,
                  files: assets,
                  options: options,
                },
                //#endregion
                appName,
                meta,
                font,
                fontSpring,
                primaryColor,
                loading,
                loadingSpring,
                getChunkUrl,
                workerScript,
                themeInject: getThemeInjectTemplate(
                  appConfig.brandConfig.code as any,
                ),
                /**
                 * support custom entry for we can test preview env in production env
                 */
                customEntryUrl: `<script>${customEntryUrl}</script>`,
                inlineScriptsLoadFailDetect: getScriptsLoadFailTemplate,
                ...templateParameters,
              };
            },
            minify: isProd
              ? {
                  // https://github.com/kangax/html-minifier#options-quick-reference
                  // default minify options with HTMLWebpackPlugin
                  // https://github.com/jantimon/html-webpack-plugin#minification
                  collapseWhitespace: true,
                  keepClosingSlash: true,
                  removeComments: true,
                  removeRedundantAttributes: true,
                  removeScriptTypeAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  useShortDoctype: true,
                  // minify inline index.html css and scripts
                  minifyCSS: true,
                  minifyJS: true,
                }
              : 'auto',
          });
        }),
    ],
  });

  if (outputUsePropsMode) {
    const filenameMap = getFinalFilePathMap(projectConfig);
    const chunkFilenames = projectConfig.projectConfig.chunkFilenames;
    // MFE with module federation should not use splitChunks
    // issue: https://github.com/module-federation/module-federation-examples/issues/692
    const enabledAutoSplitChunks =
      projectConfig.projectConfig.disabledAutoSplitChunks !== true &&
      args.env !== 'mfe';
    if (
      args.env === 'mfe' &&
      projectConfig.projectConfig.disabledAutoSplitChunks === false
    ) {
      throw new Error('MFE with module federation should not use splitChunks');
    }
    if (enabledAutoSplitChunks) {
      // Entries served from a fixed URL at the output root: pages with an
      // explicit `filename`, plus pure entries that have no page at all.
      const rootPinnedEntries = projectConfig.projectConfig.pages
        .filter((x) => !x.index || x.filename)
        .map((x) => path.basename(x.main).split('.')[0]);

      const chunks = (chunk: Chunk) => {
        // Never split a root-pinned entry. Its siblings would be injected into
        // the HTML as <script> tags, which pins them by name, and the entry
        // would then have to be versioned together with them — exactly what
        // BUILD_DIR exists to avoid. These entries stay self-contained and pull
        // anything else at runtime instead.
        const isRootPinned = Boolean(
          chunk.name && rootPinnedEntries.includes(chunk.name),
        );
        return Boolean(chunk.name) && !isRootPinned;
      };

      const isString = typeof chunkFilenames === 'string';
      const vendorFilename =
        (isString ? chunkFilenames : chunkFilenames?.[VENDOR_KEY]) ||
        DEFAULT_CHUNK_FILENAME;
      // The build folder has to be prepended outside the `modules-`/`commons-`
      // concatenation, otherwise the folder itself is named `modules-[fullhash]`.
      const splitChunkFilename = (prefix = '') =>
        `${BUILD_DIR}/${prefix}${vendorFilename}`;

      // always optimize vendor and commons chunk to separate file into small size
      // otherwise, the main chunk will be too large to host on CDN
      developmentConfig.optimization = {
        splitChunks: {
          chunks,
          filename: splitChunkFilename(), // Ensure hash is included
          minSize: 1_000_000, // 1MB
          maxSize: 9_000_000,
          /**
           * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html
           *
           * Size of objects that CloudFront compresses
           * CloudFront compresses objects that are between 1,000 bytes and 10,000,000 bytes in size.
           */
          enforceSizeThreshold: 9_000_000, // for safely
          cacheGroups: {
            vendor: {
              // import file path containing node_modules
              test: /[\\/]node_modules[\\/]/,
              filename: splitChunkFilename('modules-'), // Ensure hash is included
              reuseExistingChunk: true,
            },
            commons: {
              // import file path containing ringcentral-js-widgets
              test: /[\\/]ringcentral-js-widgets[\\/]/,
              filename: splitChunkFilename('commons-'), // Ensure hash is included
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return merge(developmentConfig, {
      output: {
        /**
         * Chunks resolve against the HTML document, not against the directory of
         * the executing script. `auto` derives the public path from
         * `document.currentScript.src` — which already points inside BUILD_DIR —
         * and would request `<hash>/<hash>/zh-CN.js`.
         */
        publicPath: publicPath ?? '',
        filename: (pathData) => {
          const chunkName = pathData?.chunk?.name;

          if (chunkName && filenameMap[chunkName]) {
            return filenameMap[chunkName];
          }

          return HASHED_FILENAME;
        },
        chunkFilename: (pathData) => {
          const isString = typeof chunkFilenames === 'string';

          if (isString) return applyBuildId(chunkFilenames);

          const chunkName = pathData.chunk?.name;
          if (!chunkName) return HASHED_CHUNK_FILENAME;

          const configured = chunkFilenames?.[chunkName];
          return configured ? applyBuildId(configured) : HASHED_CHUNK_FILENAME;
        },
      },
    });
  }

  return developmentConfig;
};
