import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		watch: {
			ignored: ['node_modules', '.git', 'public']
		}
	},
	plugins: [svelte()],
})
