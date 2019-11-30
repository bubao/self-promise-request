/*
 * @Author: bubao
 * @Date: 2018-11-21 22:52:36 
 * @Last Modified by: bubao
 * @Last Modified time: 2019-11-30 17:36:37
 */
const EventEmitter = require('events');
const Request = require('request');
const fs = require('fs');

class PromisRequest extends EventEmitter {
	constructor(){
		super();
		this.request = this.request.bind(this)
	}
	request(options) {
		const emit = this.emit
		const removeListener = thie.removeListener
		return new Promise(function(resolve) {
			const { pipe, hiden, time, size, readable, ...opts } = options;
			const start = startNum(time);
			let read = getRead(options);
			let response = 0;
			let total = 0;
			let buffer = Buffer.alloc(0);
			const res = Request(opts, function (error, res, body) {
				removeListener("process", () => { });
				resolve({ error, response: res, body, read, bufferBody: buffer.toString("utf8") });
			}).on('response', (resp) => {
				response = getLength(resp.headers['content-length'], size);
			}).on('data', function (data) {
				read += data.length;
				if (readable) buffer = Buffer.concat([buffer, data]);
				total = getTotal(size, response, read);
				emit("process", {
					completed: read, total, hiden, time: { start }, status: { down: '正在下载...', end: '完成\n' }
				});
			});
			// 如果 pipe参数存在，则下载到指定路径
			download(res, pipe);
		});
	}
}

function download(data, dir) {
	if (dir && dir.length) data.pipe(fs.createWriteStream(dir || './'));
}

/**
 * 获取已完成进度
 * @param {number} size 数据大小
 * @param {number} response 数据大小
 * @param {number} read 已读
 * @returns number
 */
function getTotal(size, response, read) {
	return (((size !== undefined || response === undefined) && size >= read) ? size : response || read + 1);
};

/**
 * 开始时间
 * @param {number} time 时间戳
 * @returns number
 */
function startNum(time) {
	return time !== undefined ? time.start : new Date().valueOf();
};
/**
 * 获取数据长度
 * @param {number} contentLength 数据长度
 * @param {number} size 数据大小
 * @returns number number
 */
function getLength(contentLength, size) {
	let length = contentLength || size;
	return length ? parseInt(length || 0, 10) : 0;
}

function getRead(options) {
	return (options.read || 0);
};

module.exports = PromisRequest;