<template>
	<div class="AppPage">
		<WindowBar ref="WinRef" min close move />

		<div class="Pane" :style="paneStyle">
			<el-upload ref="XmUploadRef" v-model:file-list="fileList" v-bind="fileProps" :onExceed="handleExceed">
				<el-button type="primary">选择文件</el-button>
			</el-upload>

			<el-descriptions class="FileInfo" :column="1" border label-width="80">
				<el-descriptions-item label="文件名称">{{ fileInfo.name }}</el-descriptions-item>
				<el-descriptions-item label="文件大小">{{ fileInfo.size }}</el-descriptions-item>
			</el-descriptions>

			<el-input v-model="slim" type="textarea" clearable />

			<el-button type="primary" @click="start">压缩</el-button>
		</div>
	</div>
</template>

<script setup>
	// 选择文件 -----------------------------------------------------------------------
	import { UploadFilled } from '@element-plus/icons-vue';
	import { genFileId } from 'element-plus';
	const fileList = ref([]);
	const fileProps = { class: 'XmUpload', showFileList: false, autoUpload: false, drag: true, limit: 1 };
	const XmUploadRef = ref(null);
	const handleExceed = files => {
		XmUploadRef.value.clearFiles();
		const file = files[0];
		file.uid = genFileId();
		XmUploadRef.value.handleStart(file);
	};

	// 文件信息 ----------------------------------------------------------------------
	import { FormatBitSize } from '@/utils/tools.js';
	const fileInfo = computed(() => ({
		name: fileList.value[0]?.name,
		size: FormatBitSize(fileList.value[0]?.size, 2, false, ''),
	}));

	// 压缩 --------------------------------------------------------------------------
	const slim = ref('');
	import { FFmpeg } from '@ffmpeg/ffmpeg';
	import { fetchFile, toBlobURL } from '@ffmpeg/util';
	const ffmpeg = new FFmpeg();

	const loadFFmpeg = async () => {
		if (ffmpeg.loaded) return;

		const baseURL = '/ffmpeg';
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
		});
	};
	loadFFmpeg();
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
			width: 500px;
			height: 500px;
			// background: var(--random-gradient);
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
			border-radius: 10px;
			overflow: hidden;
			display: flex;
			flex-direction: column;
		}

		.XmUpload {
			margin: auto;
		}
	}
</style>
