/**
 * 页面操作限制工具: 禁止缩放. 刷新. 右键菜单. 打开控制台等
 * @param {Object} options 配置项
 * @param {Boolean} options.banZoom - 是否禁止缩放 (默认false)
 * @param {Boolean} options.banRefresh - 是否禁止刷新 (默认false)
 * @param {Boolean} options.banContextMenu - 是否禁止右键菜单 (默认false)
 * @param {Boolean} options.banConsole - 是否禁止打开控制台 (默认false)
 * @returns {Function} 销毁函数: 用于手动移除所有事件监听
 */
export const BanPageOperate = (options = {}) => {
	// 默认配置
	const { banZoom = false, banRefresh = false, banContextMenu = false, banConsole = false } = options;

	// 存储所有事件监听的回调, 用于后续销毁
	const handlers = [];

	// ====================== 1. 禁止缩放相关 ======================
	const preventWheelZoom = e => {
		if (banZoom && e.ctrlKey && (e.deltaY || e.deltaX)) {
			e.preventDefault();
		}
	};

	const preventKeyZoom = e => {
		if (banZoom && e.ctrlKey && ['+', '-', '=', '0'].includes(e.key)) {
			e.preventDefault();
		}
	};

	// ====================== 2. 禁止刷新相关 ======================
	const preventKeyRefresh = e => {
		if (!banRefresh) return;

		// 拦截 F5 / Ctrl+R / Ctrl+Shift+R / Cmd+R (Mac)
		const isRefresh = e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.shiftKey && e.key === 'r') || (e.metaKey && e.key === 'r');

		if (isRefresh) {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	// ====================== 3. 禁止右键菜单 ======================
	const preventContextMenu = e => {
		if (banContextMenu || banConsole) {
			// 禁止控制台时自动禁用右键（避免检查元素）
			e.preventDefault();
		}
	};

	// ====================== 4. 禁止打开控制台 ======================
	const preventOpenConsole = e => {
		if (!banConsole) return;

		// 拦截打开控制台的快捷键：F12 / Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Cmd+Opt+I(Mac)
		const isOpenConsole = e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key)) || (e.metaKey && e.altKey && e.key === 'i'); // Mac：Cmd+Option+I

		if (isOpenConsole) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	};

	// 额外防护：检测控制台是否被打开（部分浏览器生效）
	let consoleCheckTimer = null;
	const checkConsoleOpen = () => {
		if (!banConsole) return;

		// 创建一个不可见的元素用于检测控制台尺寸
		const dummy = document.createElement('div');
		dummy.style.height = '1px';
		document.body.appendChild(dummy);

		// 控制台打开时，元素的offsetHeight会变化（Chrome/Firefox生效）
		const check = () => {
			const height = dummy.offsetHeight;
			if (height > 1) {
				// 控制台打开导致高度变化
				// 可选：控制台打开时刷新页面/隐藏内容
				// window.location.reload();
				// document.body.style.display = 'none';
			}
		};

		consoleCheckTimer = setInterval(check, 1000);
		document.body.removeChild(dummy);
	};

	// ====================== 绑定事件 ======================
	const bindEvents = () => {
		// 禁止滚轮缩放 (必须设置 passive: false 才能阻止默认行为)
		if (banZoom) {
			window.addEventListener('wheel', preventWheelZoom, { passive: false });
			window.addEventListener('keydown', preventKeyZoom);
			handlers.push({
				type: 'wheel',
				handler: preventWheelZoom,
				options: { passive: false },
			});
			handlers.push({
				type: 'keydown',
				handler: preventKeyZoom,
			});
		}

		// 禁止刷新快捷键
		if (banRefresh) {
			window.addEventListener('keydown', preventKeyRefresh);
			handlers.push({
				type: 'keydown',
				handler: preventKeyRefresh,
			});
		}

		// 禁止右键菜单
		window.addEventListener('contextmenu', preventContextMenu);
		handlers.push({
			type: 'contextmenu',
			handler: preventContextMenu,
		});

		// 禁止打开控制台
		if (banConsole) {
			window.addEventListener('keydown', preventOpenConsole);
			handlers.push({
				type: 'keydown',
				handler: preventOpenConsole,
			});
			// 启动控制台检测定时器
			checkConsoleOpen();
		}
	};

	// ====================== 销毁事件 ======================
	const destroy = () => {
		// 移除所有事件监听
		handlers.forEach(({ type, handler, options }) => {
			window.removeEventListener(type, handler, options);
		});
		handlers.length = 0; // 清空回调列表

		// 清除控制台检测定时器
		if (consoleCheckTimer) {
			clearInterval(consoleCheckTimer);
			consoleCheckTimer = null;
		}
	};

	// 初始化绑定事件
	bindEvents();

	// 返回销毁函数, 供外部手动销毁
	return destroy;
};

/**
 * 辅助函数: 快速禁止所有操作 (缩放+刷新+右键菜单+控制台)
 * @returns {Function} 销毁函数
 */
export const BanAllPageOperate = () => {
	return BanPageOperate({
		banZoom: true,
		banRefresh: true,
		banContextMenu: true,
		banConsole: true,
	});
};
