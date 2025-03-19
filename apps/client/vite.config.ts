import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            proxy: {
                '/server': {
                    target: env.VITE_API_URL || 'http://localhost:3000', // Use env variable or fallback
                    changeOrigin: true,
                },
            },
        },
        define: {
            'process.env': env, // Ensure process.env variables are available
        },
    };
});
