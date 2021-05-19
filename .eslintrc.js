module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:editorconfig/all'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    'sourceType': 'module',
  },
  plugins: ['editorconfig'],
  rules: {
    quotes: ['error', 'single'],
    'node/no-unsupported-features/es-syntax': 0
  }
};
