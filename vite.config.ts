// Add this to force CSS loading
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInclude: ['**/*.css'] // 👈 Add this line
  }
})