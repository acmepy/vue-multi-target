import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
//https://github.com/vite-pwa/vite-plugin-pwa/blob/main/examples/vue-router/vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        swSrc: 'src/sw.js',
        swDest: 'dist/sw.js',
      },
      injectRegister: false,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'vue-vite-pwa',
        short_name: 'vue-vite-pwa',
        start_url: '/app/',
        scope: '/app/',
        display: 'standalone',
        lang: 'es',
        icons: [
          { src: '/app/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/app/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  base: '/app/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, //todo en un solo archivo
      },
    },
    cssCodeSplit: false,
    //minify: 'esbuild',
    minify: false,
    //target: 'esnext',

    target: 'es2017', //para hacer compatible con dispositivos viejos

    //outDir: BUILD_DIR,
    assetsInlineLimit: 0,
    emptyOutDir: true,
  },

  esbuild: {
    keepNames: true, //mantiene nombres de funciones y clases
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
