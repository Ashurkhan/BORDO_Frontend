import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' && !process.env.VITE_RAILWAY ? '/JetiHub_Frontend/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://jetihub-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
