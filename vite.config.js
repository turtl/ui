import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		watch: {
			ignored: ['node_modules', '.git', 'public']
		}
	},
	plugins: [svelte()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
