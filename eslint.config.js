import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier, // 👈 desactiva reglas de ESLint que chocan con Prettier
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-undef': 'error', // marcar variables no declaradas
      'no-unused-vars': 'warn', // advertir variables no usadas
    },
  },
];

//import { defineConfig, globalIgnores } from 'eslint/config'
//import globals from 'globals'
//import js from '@eslint/js'
//import pluginVue from 'eslint-plugin-vue'
//import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
//
//export default defineConfig([
//  {
//    name: 'app/files-to-lint',
//    files: ['**/*.{js,mjs,jsx,vue}'],
//  },
//
//  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
//
//  {
//    languageOptions: {
//      globals: {
//        ...globals.browser,
//      },
//    },
//  },
//
//  js.configs.recommended,
//  ...pluginVue.configs['flat/essential'],
//  skipFormatting,
//])
