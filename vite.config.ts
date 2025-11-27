import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({ include: '**/*.svg?react' }),
    VitePWA({
      registerType: 'autoUpdate',

      devOptions: {
        enabled: true // REQUIRED for virtual:pwa-register in dev mode
      },
      // workbox: {
      //   runtimeCaching: [
      //     {
      //       urlPattern: /^https:\/\/jsonplaceholder\.typicode\.com\/posts/,
      //       handler: 'CacheFirst', // try cache first, then network
      //       options: {
      //         cacheName: 'posts-cache',
      //         expiration: {
      //           maxEntries: 50,
      //           maxAgeSeconds: 24 * 60 * 60 // 1 day
      //         }
      //       }
      //     }
      //   ]
      // },
      manifest: {
        name: 'My PWA App',
        short_name: 'PWA',
        theme_color: '#000000',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
