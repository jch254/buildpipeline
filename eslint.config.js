const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const importPlugin = require('eslint-plugin-import');
const cssModulesPlugin = require('eslint-plugin-css-modules');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // Base JavaScript configuration
  js.configs.recommended,

  // TypeScript and React files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        require: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      'css-modules': cssModulesPlugin,
    },
    rules: {
      // TypeScript ESLint recommended rules
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['recommended-type-checked'].rules,

      // React recommended rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,

      // React hooks rules
      ...reactHooksPlugin.configs.recommended.rules,

      // Accessibility rules (simplified)
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',

      // Import rules (disabled problematic ones, keep useful ones)
      'import/no-unresolved': 'off', // TypeScript handles this better
      'import/namespace': 'off',
      'import/default': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // CSS Modules rules
      'css-modules/no-unused-class': 'error',
      'css-modules/no-undef-class': 'error',

      // Custom rules (migrated from TSLint config)
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],

      // Line length (from TSLint config)
      'max-len': ['error', { code: 150, ignoreUrls: true }],

      // Disable some strict rules for better developer experience
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn', // Changed to warning
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-require-imports': 'off', // Allow require() for imports
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/no-unescaped-entities': 'warn', // Change to warning
      'no-undef': 'off', // TypeScript handles this better
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
    },
  },

  // Specific overrides for config files
  {
    files: ['*.config.{js,ts}', 'webpack.*.{js,ts}', 'server.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig-webpack.json',
      },
    },
    rules: {
      // More relaxed rules for config files
      '@typescript-eslint/no-var-requires': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**', 'ts/**', '*.d.ts'],
  },

  // Prettier integration - must be last to override conflicting rules
  prettierConfig,
];
