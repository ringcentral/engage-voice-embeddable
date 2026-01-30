const baseConfig = require('./next/tailwind.base.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [baseConfig()],
  content: [
    './next/index.html',
    './next/*.{tsx,ts}',
    './next/app/**/*.{tsx,ts}',
    './node_modules/@ringcentral/spring-ui/**/*.{js,ts,jsx,tsx}',
  ],
};
