import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/recommend': {
        target: 'https://breeding-recommender-api-896191931404.us-central1.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/recommend/, '/recommend')
      }
    }
  },
  alias: {
    '@shadcn/ui': '/node_modules/@shadcn/ui',  // Adjust this path if needed
  }
})
