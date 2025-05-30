// eslint.config.mjs
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
  prettier,
];
