module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  globals: {
    nj: true,
    jasmine: true,
    expect: true,
    describe: true,
    it: true,
    beforeEach: true,
    afterEach: true,
  },
  parserOptions: {
    ecmaVersion: '2020',
  },
  extends: ['eslint:recommended'],
  rules: {
    'indent': 'off',
    'semi': ['error', 'always', { omitLastInOneLineBlock: true }],
    'quotes': ['warn', 'single'],
    'object-shorthand': 'off',
    'template-curly-spacing': 'off',
    'no-prototype-builtins': 'off',
    'quote-props': ['warn', 'consistent-as-needed'],
  },
};
