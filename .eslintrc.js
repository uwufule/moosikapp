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
  plugins: [
    'import',
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'no-bitwise': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/anchor-is-valid': ['error', {
      'components': [
        'Link',
      ],
      'specialLink': [
        'hrefLeft',
        'hrefRight',
      ],
      'aspects': [
        'invalidHref',
        'preferButton',
      ],
    }],
  },
  settings: {
    'import/resolver': {
      typescript: {
        directory: 'src/frontend',
      }
    },
  },
};
