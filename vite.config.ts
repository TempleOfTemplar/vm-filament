import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    assetsInclude: ['**/*.gltf'],
    plugins: [
        laravel({
            input: 'resources/js/index.tsx',
            refresh: true,
        }),
        react(),
    ],
});