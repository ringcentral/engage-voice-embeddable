module.exports = {
  preset: 'jest-puppeteer',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/tests/e2e/**/*.test.ts'],
  reporters: ['default'],
  maxConcurrency: 1,
};
