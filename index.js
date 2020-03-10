/**
 * @Description:
 * @Author: bubao
 * @Date: 2018-11-21 22:52:36
 * @LastEditors: bubao
 * @LastEditTime: 2020-03-10 21:20:25
 */
const EventEmitter = require("events");
const Request = require("request");
const { getRead, getLength, getTotal, startNum } = require("./utils/index");

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
			Request(opts, function(error, res, body) {
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
		});
	}
}

module.exports = PromisRequest;
