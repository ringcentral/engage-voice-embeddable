/**
 * Unit tests for pure functions.
 *
 * Separate from jest.config.js because that one runs the Puppeteer e2e suite
 * and only matches `tests/e2e/**`.
 */
const path = require('path');

module.exports = {
  // The hoisted jest-environment-node is v27 while the rest of Jest is v30,
  // which breaks the runtime; point at the copy that matches.
  testEnvironment: path.resolve(
    __dirname,
    'node_modules/jest-runner/node_modules/jest-environment-node',
  ),
  transform: {
    // Transpile-only. ts-jest warns that this option is deprecated, but the
    // alternatives build a full TypeScript program, which takes the suite from
    // ~4s to ~2min and surfaces the app's pre-existing type errors as test
    // failures. Types are checked by the build, not here.
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
  },
  // Each i18n bundle's loadLocale.ts is a build-time placeholder that the
  // locale-loader plugin rewrites, so it is not a function under Jest.
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^\./loadLocale$': '<rootDir>/tests/stubs/loadLocale.js',
  },
  testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
  reporters: ['default'],
};
