/**
 * @Description:
 * @Author: bubao
 * @Date: 2020-03-10 16:16:16
 * @LastEditors: bubao
 * @LastEditTime: 2020-03-10 21:02:53
 */
const slog = require("single-line-log").stdout;
const clicolor = require("cli-color");

/**
 * 字节转换
 * @param {number} limit
 */
function byteSize(limit) {
	let size = "";
	if (limit === undefined) return "";
	if (limit < 0.1 * 1024) {
		// 小于0.1KB，则转化成B
		size = `${limit.toFixed(2)}B`;
	} else if (limit < 0.1 * 1024 * 1024) {
		// 小于0.1MB，则转化成KB
		size = `${(limit / 1024).toFixed(2)}KB`;
	} else if (limit < 0.1 * 1024 * 1024 * 1024) {
		// 小于0.1GB，则转化成MB
		size = `${(limit / (1024 * 1024)).toFixed(2)}MB`;
	} else {
		// 其他转化成GB
		size = `${(limit / (1024 * 1024 * 1024)).toFixed(2)}GB`;
	}

	const sizeStr = `${size}`; // 转成字符串
	const index = sizeStr.indexOf("."); // 获取小数点处的索引
	const dou = sizeStr.substr(index + 1, 2); // 获取小数点后两位的值
	if (dou === "00") {
		// 判断后两位是否为00，如果是则删除00
		return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
	}
	return size;
}

/**
 * 时间转化
 * @param {number} d date
 */
function time(d) {
	d = parseInt(d, 10);
	let s = 0;
	let m = 0;
	let h = 0;
	let t = "";
	if (d < 60) {
		s = d % 60;
		t = `${s} 秒`;
	} else if (d < 60 * 60) {
		s = d % 60;
		m = (d - s) / 60;
		t = `${m} 分 ${s}秒`;
	} else {
		h = parseInt(d / 60 / 60, 10);
		m = parseInt((d - h * 60 * 60) / 60, 10);
		s = d - h * 60 * 60 - m * 60;
		t = `${h}:${m}:${s}`;
	}
	return t;
}

/**
 * 获取已完成进度
 * @param {number} size 数据大小
 * @param {number} response 数据大小
 * @param {number} read 已读
 * @returns number
 */
function getTotal(size, response, read) {
	return (size !== undefined || response === undefined) && size >= read
		? size
		: response || read + 1;
}

/**
 * 开始时间
 * @param {number} time 时间戳
 * @returns number
 */
function startNum(time) {
	return time !== undefined ? time.start : new Date().valueOf();
}

/**
 * 获取数据长度
 * @param {number} contentLength 数据长度
 * @param {number} size 数据大小
 * @returns number number
 */
function getLength(contentLength, size) {
	const length = contentLength || size;
	return length ? parseInt(length || 0, 10) : 0;
}

function getRead(options) {
	return options.read || 0;
}

module.exports = {
	slog,
	clicolor,
	time,
	byteSize,
	getRead,
	getLength,
	startNum,
	getTotal
};
