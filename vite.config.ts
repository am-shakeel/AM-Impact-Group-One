import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Sets the base path for deployment. './' ensures relative paths work on any subdomain/repo
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});