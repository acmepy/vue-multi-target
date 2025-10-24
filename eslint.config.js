import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import { cordovaGlobals, electronGlobals } from './eslint.globals';

export default [
  js.configs.recommended,
  prettier,
  {
    languageOptions: { globals: globals.browser, ecmaVersion: 'latest', sourceType: 'module' },
    rules: { 'no-undef': 'error', 'no-unused-vars': 'warn' },
  },
  {
    files: ['src/sw.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.serviceworker } },
  },
  {
    files: ['cordova/www/**/*.js'],
    languageOptions: { globals: { ...globals.browser, ...cordovaGlobals } },
  },
  {
    files: ['electron/src/**/*.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...electronGlobals } },
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
