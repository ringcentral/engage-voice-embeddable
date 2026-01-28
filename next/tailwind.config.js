const baseConfig = require('./tailwind.base.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [baseConfig()],
  content: [
    './index.html',
    './*.{tsx,ts}',
    './app/**/*.{tsx,ts}',
    '../node_modules/@ringcentral/spring-ui/**/*.{js,ts,jsx,tsx}',
  ],
};
