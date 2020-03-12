/*
 * @Author: bubao
 * @Date: 2018-11-21 22:52:36
 * @Last Modified by: bubao
 * @Last Modified time: 2019-12-01 03:23:52
 */
const EventEmitter = require("events");
const Request = require("request");
const fs = require("fs");
const Downloader = require("./src/downloader");

class PromisRequest extends EventEmitter {
	constructor() {
		super();
		this.instance = null;
		this.request = this.request.bind(this);
	}

	static init() {
		if (!this.instance) {
			const that = this;
			this.instance = new that();
		}
		return this.instance;
	}

	request(options) {
		const that = this;
		const { pipe, hiden, time, size, readable, ...opts } = options;
		const start = startNum(time);
		let read = getRead(options);
		let response = 0;
		let total = 0;
		let speed = 0;
		let buffer = Buffer.alloc(0);
		const Interval = setInterval(() => {
			that.emit("process", {
				completed: read,
				total: total,
				hiden,
				speed,
				time: { start },
				status: { down: "正在下载...", end: "完成\n" }
			});
			speed = 0;
		}, 1000);
		return new Promise(function(resolve) {
			const res = Request(opts, function(error, res, body) {
				resolve({
					error,
					response: res,
					body,
					read,
					bufferBody: buffer.toString("utf8")
				});
			})
				.on("response", resp => {
					response = getLength(resp.headers["content-length"], size);
				})
				.on("data", function(data) {
					speed += data.length;
					read += data.length;

					if (readable) buffer = Buffer.concat([buffer, data]);
					total = getTotal(size, response, read);
				})
				.on("end", () => {
					that.emit("process", {
						completed: read,
						total: total,
						hiden,
						speed,
						time: { start },
						status: { down: "正在下载...", end: "完成\n" }
					});
					clearInterval(Interval);
				});
			// 如果 pipe参数存在，则下载到指定路径
			download(res, pipe);
		});
	}
}

function download(data, dir) {
	if (dir && dir.length) data.pipe(fs.createWriteStream(dir || "./"));
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
PromisRequest.Downloader = Downloader;
module.exports = PromisRequest;
