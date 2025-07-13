// Replace your vite.config.ts with:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  assetsInclude: ['**/*.css']
});