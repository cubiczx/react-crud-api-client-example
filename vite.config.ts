import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'build',
  },
  server: {
    port: parseInt(process.env.VITE_PORT || '3000', 10),
    proxy: {
      '/customers': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3000', // Backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/customers/, '/customers'),
      },
    },
  },
});

