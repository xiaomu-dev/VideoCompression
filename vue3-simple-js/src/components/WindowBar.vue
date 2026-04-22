<template>
	<div class="WindowBar">
		<div class="MoveArea" @mousedown.native="winMove" v-if="props.move">
			<div class="MoveAreaInner">{{ props.title }}</div>
		</div>
		<div class="BarBtns">
			<el-icon id="Aardio_Min" @click="winMin" class="Icon" v-if="props.min"><Minus /></el-icon>
			<el-icon id="Aardio_Max" @click="winMax" class="Icon Full" v-if="props.max"><FullScreen /></el-icon>
			<el-icon id="Aardio_Close" @click="winClose" class="Icon Close" v-if="props.close"><Close /></el-icon>
		</div>
	</div>
</template>

<script setup>
	import { Minus, FullScreen, Close } from '@element-plus/icons-vue';

	const props = defineProps({
		min: { type: Boolean, default: false },
		max: { type: Boolean, default: false },
		close: { type: Boolean, default: false },
		move: { type: Boolean, default: false },
		title: { type: String, default: '' },
	});

	// aardio 事件
	// 不能简写, 必须要{}, 不然报错
	const winMove = () => {
		window.aardio?.win_move();
	};
	const winMin = () => {
		window.aardio?.win_min();
	};
	const winMax = () => {
		window.aardio?.win_max();
	};
	const winClose = () => {
		window.aardio?.win_close();
	};
	const winTop = flag => {
		window.aardio?.win_restore();
		window.aardio?.win_active(true);
		window.aardio?.win_top(flag);
	};
	defineExpose({ winMin, winMax, winClose, winTop });
</script>

<style scoped>
	.WindowBar {
		display: flex;
		align-items: center;
		user-select: none;
		overflow: hidden;
		box-sizing: border-box;

		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 32px;
		z-index: 99999;
	}

	.MoveArea {
		flex: 1;
		cursor: move;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.MoveAreaInner {
		font-size: 14px;
	}

	.BarBtns {
		display: flex;
		gap: 5px;
		justify-content: flex-end;
		padding: 0 10px;
		height: 100%;
		align-items: center;

		.Icon {
			width: 20px;
			height: 20px;
			border-radius: 50%;
			border: none;
			background: none;
			font-size: 14px;
			font-weight: bold;
			color: #fff;
			cursor: pointer;
			transition: all 0.3s ease-in-out;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.Icon:hover {
			background-color: #ffffff;
			color: #000000;
		}

		.Full {
			font-size: 12px;
		}

		.Close {
			&:hover {
				background: #f56c6c;
				color: #fff;
			}
		}
	}
</style>
