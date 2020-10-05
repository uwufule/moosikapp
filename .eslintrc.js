module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:json/recommended',
    'plugin:react/recommended',
    'airbnb-typescript',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    React: 'writable',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },
  plugins: ['import', 'prettier', 'react', '@typescript-eslint'],
  rules: {
    'no-underscore-dangle': ['error', {
      allowAfterThis: true
    }],
    'react/require-default-props': 'off',
    'no-bitwise': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        labelAttributes: ['label'],
        controlComponents: ['Input'],
        depth: 3,
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        directory: 'src/frontend',
      },
    },
  },
};