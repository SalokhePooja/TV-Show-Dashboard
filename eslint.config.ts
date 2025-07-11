import vueEslintParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['src/**/*.{ts,js,vue}'],
    ignores: ['node_modules', 'dist'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
    },
    plugins: {
      vue: vuePlugin,
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off', // Allow single word names
      // Add more custom rules here
    },
  },
];