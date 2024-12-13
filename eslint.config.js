import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        google: 'readonly',
        process: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      prettier: pluginPrettier,
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
      ],
      curly: ['error', 'multi-line'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'prefer-template': 'warn',
      'no-loop-func': 'warn',

      // Regras recomendadas do JavaScript
      ...pluginJs.configs.recommended.rules,

      // Regras recomendadas do React
      ...pluginReact.configs.flat.recommended.rules,
      'react/prop-types': 'warn',
      'react/jsx-boolean-value': ['error', 'always'],
      'react/jsx-no-bind': [
        'warn',
        { ignoreRefs: true, allowArrowFunctions: true },
      ],
      'react/react-in-jsx-scope': 'off',

      // Regras para react-hooks
      ...pluginReactHooks.configs.recommended.rules,

      // Regras de plugins adicionais
      'prettier/prettier': 'error',
    },
  },
];
