import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import mkcert from'vite-plugin-mkcert'

export default defineConfig({
    server: {
        https: true
    },
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
