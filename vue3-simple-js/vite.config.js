import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 自动导入
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
	build: {
		outDir: path.resolve(__dirname, '../res'), // 输出目录
		emptyOutDir: true, // 清空目标目录
	},
	plugins: [
		vue(),
		AutoImport({
			imports: ['vue', 'vue-router', 'pinia'],
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
	],
	resolve: {
		alias: {
			'@~': path.resolve(__dirname, '/'),
			'@': path.resolve(__dirname, 'src'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: { additionalData: `@use '@/styles/variables.scss' as *;` },
		},
	},
	server: { host: true, port: 9527, open: true },
});
