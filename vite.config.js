import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
    plugins: [react()],
    base: '/',
    server: {
        port: 3000
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'chakra-vendor': ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
                    'particles-vendor': ['@tsparticles/react', '@tsparticles/slim'],
                    'icons': ['lucide-react']
                }
            }
        }
    }
}))
