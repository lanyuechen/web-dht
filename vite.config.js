import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

let base = '/';
if (process.env.NODE_ENV === 'production') {
  // base = '/web-dht/';
  base = 'https://cdn.jsdelivr.net/gh/lanyuechen/web-dht@gh-pages/';
}

// https://vitejs.dev/config/
export default defineConfig({
  base,
  build: {
    assetsDir: '',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
  ],
})
