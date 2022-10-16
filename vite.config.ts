import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import mkcert from'vite-plugin-mkcert'

export default defineConfig({
    server: {
        https: true,
        port: 8000,
        host: '127.0.0.1',
        hmr: {
            host: '127.0.0.1',
        },
    },
    // root: 'resources/js',
    assetsInclude: ['**/*.gltf'],
    plugins: [
        mkcert(),
        laravel({
            input: 'resources/js/index.tsx',
            refresh: true,
        }),
        react(),
    ],
});
