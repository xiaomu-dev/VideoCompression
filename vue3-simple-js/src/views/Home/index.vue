<template>
	<div class="AppPage">
		<div class="Pane" :style="paneStyle">
			<WindowBar ref="WinRef" min close move />
		</div>
	</div>
</template>

<script setup>
	// 随机渐变背景 ----------------------------------------------------------------------
	import { GetRandomGradient } from '@/utils/color.js';
	const paneStyle = ref({});
	const refreshGradient = () => (paneStyle.value = { '--random-gradient': GetRandomGradient(2) });
	refreshGradient();

	// aardio 自定义标题栏 ----------------------------------------------------------------------
	import WindowBar from '@/components/WindowBar.vue';
	const WinRef = ref(null);
</script>

<style lang="scss" scoped>
	html {
		background: transparent;
	}

	.AppPage {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		user-select: none;

		.Pane {
			position: relative;
			width: 500px;
			height: 300px;
			// background: var(--random-gradient);
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
			border-radius: 10px;
			overflow: hidden;

			.Title {
				font-size: 40px;
				font-weight: bold;
				text-align: center;
				margin: 40px 0;
				color: #fff;
				letter-spacing: 10px;
			}

			.SetPane {
				display: flex;
				justify-content: space-evenly;
				margin: 30px 0;
			}

			.Btns {
				display: flex;
				justify-content: space-evenly;
				margin: 20px 0;
				.el-button {
					width: 120px;
				}
			}

			.IsDown {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				background: rgba(0, 0, 0, 0.5);
				z-index: 100;
				.Box {
					text-align: center;
					background: #fff;
					border-radius: 10px;
					padding: 10px;
					.Title {
						font-size: 24px;
						font-weight: bold;
						margin: 20px;
						color: var(--el-color-success);
					}
				}
			}
		}
	}
</style>
