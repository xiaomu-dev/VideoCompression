/**
 * 生成十六进制颜色值
 * @param {Boolean} withSharp - 是否带 # 前缀
 * @param {Boolean} upperCase - 是否返回大写
 * @returns {string} 随机颜色值, 如 #f48fb1 / f48fb1 / F48FB1
 */
export const GetRandomColor = (withSharp = true, upperCase = false) => {
	// 1. 生成 0 ~ 0xffffff 之间的随机整数(包含边界值)
	const randomNum = Math.floor(Math.random() * (0xffffff + 1));
	// 2. 转为16进制字符串, 补全前导0(确保6位)
	let color = randomNum.toString(16).padStart(6, '0');
	// 3. 转为大写
	if (upperCase) color = color.toUpperCase();
	// 4. 添加 # 前缀
	return withSharp ? `#${color}` : color;
};

/**
 * 生成指定数量的随机颜色
 * @param {Number} count - 需要生成的颜色数量
 * @param {Boolean} same - 是否允许生成相同颜色
 * @returns
 */
export const GetRandomColors = (count = 2, same = false) => {
	const validCount = Math.max(1, Math.min(Number(count) || 2, 16777216));
	const validSame = Boolean(same);

	const colorSet = new Set();
	while (colorSet.size < validCount) {
		const color = GetRandomColor();
		if (validSame || !colorSet.has(color)) {
			colorSet.add(color);
		}
		if (!validSame && colorSet.size >= 16777216) {
			console.warn('已达到最大不重复颜色数量, 停止生成');
			break;
		}
	}

	return Array.from(colorSet);
};

/**
 * 从指定列表中随机生成一个渐变方向
 * @param {string[]} directions - 可选的渐变方向列表
 * @returns {string} 随机渐变方向
 */
export const GetRandomDirection = (directions = []) => {
	// 1. 校验入参
	const validDirections = Array.isArray(directions)
		? directions.filter(dir => typeof dir === 'string' && dir.trim() !== '') // 过滤非字符串/空字符串
		: [];

	// 2. 边界兜底
	const finalDirections = validDirections.length > 0 ? validDirections : ['to right', 'to bottom', 'to bottom right', 'to bottom left', 'to top right', 'to top left'];

	// 3. 随机选择方向
	const randomIndex = Math.floor(Math.random() * finalDirections.length);
	return finalDirections[randomIndex];
};

/**
 * 生成随机线性渐变样式
 * @param {Number} count - 渐变颜色数量 ( 2 - 10 )
 * @param {string[]} directions - 可选的渐变方向列表
 * @returns {string} 完整的线性渐变样式
 */
export const GetRandomGradient = (count = 2, directions = []) => {
	// 1. 校验并修正颜色数量
	const validCount = Math.max(2, Math.min(Number(count) || 2, 10));

	// 2. 生成不重复的随机颜色
	const colors = GetRandomColors(validCount, false);

	// 3. 兜底
	const fallbackColors = ['#ffffff', '#000000']; // 白到黑兜底
	const finalColors = colors.length >= 2 ? colors : fallbackColors;

	// 4. 获取随机渐变方向
	const randomDirection = GetRandomDirection(directions);

	// 5. 生成最终
	return `linear-gradient(${randomDirection}, ${finalColors.join(', ')})`;
};
