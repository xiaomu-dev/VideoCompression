// ----------------------------------------------------------------------------------------------------------------------
/**
 * 尺寸转字符串
 * @param {number|string} size
 * @param {string} def 默认值
 * @returns {string} 转后值
 */
export const FormatSize = (size, def = '') => {
	if (typeof size === 'number') return `${size}px`;
	if (typeof size === 'string') return size;
	return def;
};

// ----------------------------------------------------------------------------------------------------------------------
/**
 * 判断是否为有效的URL
 * @param {string} url - 待校验的URL字符串
 * @param {string[]} [protocols=['http', 'https']] - 允许的协议列表 (如 ['ftp', 'ssh'])
 * @returns {boolean} 是否为有效URL
 */
export const IsUrl = (url, protocols = ['http', 'https']) => {
	// 非字符串直接返回false
	if (typeof url !== 'string') return false;

	// 处理协议参数
	const validProtocols = [...new Set(protocols)].filter(p => typeof p === 'string' && /^[a-zA-Z]+$/.test(p));
	const finalProtocols = validProtocols.length > 0 ? validProtocols : ['http', 'https'];

	// 动态生成协议部分的正则
	const protocolReg = `(?:(${finalProtocols.join('|')})://)?`;

	// 主机部分正则: 支持域名,IPv4,localhost
	const hostReg = '(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}|(?:\\d{1,3}\\.){3}\\d{1,3}|localhost)';

	// 可选端口 (1-65535)
	const portReg = '(?::\\d{1,5})?';

	// 可选路径/查询/哈希 (不包含空格)
	const pathReg = '(?:/[^\\s]*)?';

	// 组合完整正则 (^ 开头, $ 结尾, i 忽略大小写)
	const urlReg = new RegExp(`^${protocolReg}${hostReg}${portReg}${pathReg}$`, 'i');

	return urlReg.test(url);
};

// ----------------------------------------------------------------------------------------------------------------------
/**
 * select 搜索
 * 默认搜索label字段
 * @param {string} query - 搜索关键词
 * @param {Array} all - 全部选项
 * @param {boolean} [two=false] - 搜两列
 * @param {string} [label='label'] - label字段名
 * @param {string} [value='value'] - value字段名
 * @returns {Array} 搜索结果
 */
export const FilterSelect = (query, all, two = false, label = 'label', value = 'value') => {
	const q = query.trim().toLowerCase();
	let res = [];
	if (two) res = all.filter(v => v[label].toLowerCase().includes(q) || v[value].toLowerCase().includes(q));
	else res = all.filter(v => v[label].toLowerCase().includes(q));
	return res;
};

// ----------------------------------------------------------------------------------------------------------------------
/**
 * select 自定义搜索（支持任意数量字段）
 * @param {string} query - element-ui select 搜索关键词
 * @param {Array} data - 全部的数据数组（数组项为对象）
 * @param {Array<string>} fields - 需要搜索的字段名数组（如 ['name', 'code', 'desc']）
 * @returns {Array} 过滤后的结果数组
 */
export const FilterSelectFun = (query, data, fields) => {
	// 无搜索关键词/无数据/无搜索字段时
	if (!query || !Array.isArray(data) || !Array.isArray(fields) || fields.length === 0) {
		return [...data];
	}

	// 处理搜索关键词：去空格 + 转小写
	const queryStr = query.trim().toLowerCase();
	if (queryStr === '') {
		return [...data];
	}

	// 多字段模糊搜索
	return data.filter(item => {
		// 确保当前项是对象
		if (typeof item !== 'object' || item === null) {
			return false;
		}

		// 遍历所有搜索字段
		return fields.some(field => {
			// 字段值可能为 null/undefined, 先兜底, 再转小写匹配
			const fieldValue = item[field]?.toString().toLowerCase() || '';
			return fieldValue.includes(queryStr);
		});
	});
};

// ----------------------------------------------------------------------------------------------------------------------
/**
 * 文件名安全处理
 * 防止存文件的服务器使用的系统不支持当前文件名
 * @param {string} fileName 文件名
 * @param {string} defName 默认值
 * @returns {string} 安全的文件名
 */
export const FileSafeName = (fileName, defName = '未命名文件') => {
	if (!fileName || fileName.trim() === '') return defName;

	// 替换各系统核心非法字符
	let safeName = fileName.replace(/[\\/:*?"'<>\|[\x00-\x1F]]/g, '_');

	// 移除首尾的空格/点（Windows不允许）
	safeName = safeName.replace(/^\s+|\s+$/g, '').replace(/\.+$/, '');
	// 处理Windows保留设备名
	const windowsReservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
	const baseName = safeName.split('.')[0] || ''; // 取文件名主体（不含后缀）
	if (windowsReservedNames.includes(baseName.toUpperCase())) {
		safeName = `${safeName}_`; // 保留名后加下划线（如 CON → CON_）
	}

	// 限制文件名长度（所有系统≤255字符）
	const maxLength = 255;
	if (safeName.length > maxLength) {
		// 保留后缀的前提下截断
		const extIndex = safeName.lastIndexOf('.');
		if (extIndex > -1) {
			const ext = safeName.slice(extIndex); // 后缀（如 .pdf）
			const nameBody = safeName.slice(0, extIndex); // 主体
			const truncatedBody = nameBody.slice(0, maxLength - ext.length);
			safeName = `${truncatedBody}${ext}`;
		} else {
			safeName = safeName.slice(0, maxLength); // 无后缀直接截断
		}
	}

	return safeName.trim() || defName;
};

/**
 * 格式化文件大小（字节转B/K/M/G）
 * @param {number} bytes - 文件大小（字节）
 * @param {number} point - 小数位数
 * @param {boolean} jian - 是否简写
 * @param {string} def - 默认值
 * @returns {string} 格式化后的大小文本
 */
export const FormatBitSize = (bytes, point = 2, jian = true, def = '-') => {
	if (!bytes) return def;
	if (bytes === 0) return def;

	const units = jian ? ['B', 'K', 'M', 'G'] : ['Bytes', 'Kb', 'Mb', 'Gb']; // 单位数组
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(point)} ${units[unitIndex]}`;
};

/**
 * 从 File/URL/Base64 获取图片宽高
 * @param {File|string} source - 图片源（File 对象 | 网络URL | Base64字符串）
 * @returns {Promise<{width: number, height: number}>} 图片宽高
 */
export const GetImageWH = source => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous'; // 跨域

		// 资源清理
		const cleanUp = urlToRevoke => {
			img.onload = null;
			img.onerror = null;
			if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
		};

		// 加载成功: 获取宽高并立即清理资源
		img.onload = () => {
			const result = { width: img.width, height: img.height };
			cleanUp(img.src.startsWith('blob:') ? img.src : null); // 立即释放资源
			resolve(result);
		};

		// 加载失败: 清理资源并抛出错误
		img.onerror = err => {
			cleanUp(img.src.startsWith('blob:') ? img.src : null);
			reject(new Error('图片加载失败, 无法获取宽高: ' + err.message));
		};

		// 处理不同类型的入参
		try {
			if (source instanceof File) img.src = URL.createObjectURL(source);
			else if (typeof source === 'string') {
				img.src = source;
				// 校验是否为合法的图片地址（基础校验）
				if (!source.startsWith('http') && !source.startsWith('data:image') && !source.startsWith('blob:')) {
					reject(new Error('无效的图片链接格式'));
					cleanUp();
				}
			} else {
				reject(new Error('入参类型错误, 仅支持File对象、图片URL、Base64字符串'));
				cleanUp();
			}
		} catch (e) {
			reject(new Error('处理图片源失败: ' + e.message));
			cleanUp();
		}
	});
};

/**
 * 禁用树上的某个节点
 * @param {string | number} val - 要禁用的节点的id
 * @param {Array} treeData - 要操作的树形数据
 * @param {object} treeProps - 树形数据属性配置
 * @param {string} [treeProps.id='id'] - id 字段名
 * @param {string} [treeProps.children='children'] - 子级字段名
 * @param {string} [treeProps.disabled='disabled'] - 禁用字段名
 * @param {object} disProps - 禁用属性配置
 * @param {boolean} [disProps.self=true] - 是否禁用自身
 * @param {boolean} [disProps.children=true] - 是否禁用子集
 * @returns {Array} 禁用后的树形数据
 */
import { klona } from 'klona';
export const DisableTreeNode = (val, treeData, treeProps = {}, disProps = {}) => {
	// 默认配置
	const props = { id: 'id', children: 'children', disabled: 'disabled', ...treeProps };
	const disable = { self: true, children: true, ...disProps };

	// 递归禁用节点
	const disableNode = items => {
		if (!items || !items.length) return;

		items.forEach(item => {
			// 匹配到目标节点
			if (item[props.id] === val) {
				// 禁用自身
				if (disable.self) item[props.disabled] = true;

				// 禁用所有子级
				if (disable.children) {
					const disableChildren = childItems => {
						if (!childItems) return;
						childItems.forEach(c => {
							c[props.disabled] = true;
							disableChildren(c[props.children]);
						});
					};
					disableChildren(item[props.children]);
				}
			}

			// 继续递归查找
			if (item[props.children]) disableNode(item[props.children]);
		});
	};

	// 不污染原数据
	const tree = klona(treeData);
	disableNode(tree);
	return tree;
};
