import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
//https://github.com/vite-pwa/vite-plugin-pwa/blob/main/examples/vue-router/vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      manifest: {
        name: 'vue-vite-pwa',
        short_name: 'vue-vite-pwa',
        lang: 'es',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
