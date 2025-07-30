import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  
  return {
    plugins: [react()],
    server: {
      // Only proxy in development
      ...(env.VITE_DEBUG === "true" && {
        proxy: {
          "/api": {
            target: env.VITE_API_PROXY_TARGET || "http://localhost:8000",
            changeOrigin: true,
            secure: false
          }
        }
      })
    },
    build: {
      // Optimize for production
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            clerk: ['@clerk/clerk-react']
          }
        }
      }
    }
  }
})