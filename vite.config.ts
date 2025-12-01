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
      '@': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './src/lib'), // ['src/lib/*'],
      '@components': path.resolve(__dirname, './src/components'), // ['src/components/*'],
      '@features': path.resolve(__dirname, './src/features'), // ['src/features/*'],
      '@constant': path.resolve(__dirname, './src/constant'), // ['src/constant/*'],
      '@api': path.resolve(__dirname, './src/api'), // ['src/api/*'],
      '@assets': path.resolve(__dirname, './src/assets'), // ['src/assets/*'],
      '@config': path.resolve(__dirname, './src/config'), // ['src/config/*'],
      '@helper': path.resolve(__dirname, './src/helper'), // ['src/helper/*'],
      '@hooks': path.resolve(__dirname, './src/hooks'), // ['src/hooks/*'],
      '@redux': path.resolve(__dirname, './src/redux'), // ['src/redux/*'],
      '@pages': path.resolve(__dirname, './src/pages'), // ['src/pages/*'],
      '@styles': path.resolve(__dirname, './src/styles'), // ['src/styles/*'],
      '@schema': path.resolve(__dirname, './src/schema'), // ['src/schema/*'],
      '@router': path.resolve(__dirname, './src/router') // ['src/router/*']
    }
  }
});
