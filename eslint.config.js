import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  // Base JS recommended rules
  js.configs.recommended,

  // React files
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
      'react/prop-types': 'off', // Relaxed for a newer developer
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-unescaped-entities': 'warn',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General quality rules — catch real mistakes, not style nitpicks
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off', // Allow console for now
      'no-debugger': 'warn',
      'no-duplicate-case': 'error',
      'no-empty': 'warn',
      'no-extra-semi': 'error',
      'no-undef': 'error',
      'prefer-const': 'warn',
      'no-var': 'error',
      'eqeqeq': ['warn', 'always'],
    },
  },

  // Ignore build output and dependencies
  {
    ignores: ['dist/**', 'node_modules/**', 'old/**', 'worker/**', 'scripts/**'],
  },
];
