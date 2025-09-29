// @ts-check

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
module.exports = {
  // Base Prettier configuration
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,

  // Enable plugins
  plugins: ['prettier-plugin-css-order', 'prettier-plugin-sh'],

  // File-specific overrides
  overrides: [
    {
      files: ['**/*.bash', '**/*.sh'],
      options: {
        parser: 'sh',
        tabWidth: 2,
        printWidth: 80,
      },
    },
  ],
};
