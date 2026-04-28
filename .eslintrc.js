module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  globals: {
    wx: 'readonly',
    App: 'readonly',
    Page: 'readonly',
    Component: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly',
    requirePlugin: 'readonly',
    cloud: 'readonly',
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prefer-const': 'warn',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'indent': ['warn', 2, { SwitchCase: 1 }],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'never'],
    'comma-dangle': ['warn', 'always-multiline'],
  },
}
