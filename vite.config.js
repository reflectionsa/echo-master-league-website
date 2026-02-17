import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
    plugins: [react()],
    base: mode === 'production' ? '/echo-master-league-website/' : '/',
    server: {
        port: 3000
    }
}))
