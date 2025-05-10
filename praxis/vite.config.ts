import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          monaco: ['@monaco-editor/react'],
          react: ['react', 'react-dom', 'react-redux']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true
  },
  define: {
    'process.env': {}
  }
})