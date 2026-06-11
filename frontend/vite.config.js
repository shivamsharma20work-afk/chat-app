import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': 'http://backend:5001',
      '/socket.io': {
        target: 'http://backend:5001',
        ws: true
      }
    }
  }
})