import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
    plugins: [
        laravel({
                input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
        define: {
            'process.env': {}
        },
        server: {
            host: '0.0.0.0',
            port: 5173,
            hmr: {
                host: 'localhost',
                protocol: 'ws',
                clientPort: 5173
            },
            watch: {
                usePolling: true,
            },
        },
    optimizeDeps: {
        include: ['lucide-react']
        },
        envPrefix: ['VITE_'],
        resolve: {
            alias: {
                '@': '/resources/js',
            },
        },
    };
});
