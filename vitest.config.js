import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path';

export default defineConfig({
    server: {
        watch: {
            ignored: ['node_modules', '.git', 'public']
        }
    },
    plugins: [svelte({ hot: !process.env.VITEST })],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        globalSetup: [
            './test/global.js',
        ],
        setupFiles: [
            './test/setup.js',
        ],
        environment: 'jsdom',
    },
})

