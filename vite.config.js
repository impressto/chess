import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Copy service worker to root of dist after build
    {
      name: 'copy-service-worker',
      closeBundle() {
        copyFileSync(
          resolve(__dirname, 'public/service-worker.js'),
          resolve(__dirname, 'service-worker.js')
        )
        console.log('✓ Copied service-worker.js to root')
      }
    }
  ],
  base: '/chess/dist/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
})
