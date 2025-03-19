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
                '@': path.resolve(__dirname, './src'), // Set up alias for easier imports
            },
        },
        server: {
            proxy: {
                '/server': {
                    target: env.VITE_API_URL || 'http://localhost:3000', // Use environment variable or fallback
                    changeOrigin: true, // For cross-origin requests
                    secure: false, // For self-signed certificates
                },
            },
        },
        define: {
            // Ensure process.env variables are available for the frontend
            'process.env': env,
        },
    };
});
