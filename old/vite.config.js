import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@api': '/src/api',
    },
  },
  base: '/', // Change this to '/your-repo-name/' for GitHub Pages
});
