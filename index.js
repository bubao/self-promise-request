/**
 * @Description:
 * @Author: bubao
 * @Date: 2018-11-21 22:52:36
 * @last author: bubao
 * @last edit time: 2021-02-06 18:21:08
 */
const EventEmitter = require("events");
const Request = require("request");
const { getRead, getLength, getTotal, startNum } = require("./utils/index");
const Downloader = require("./src/downloader");

class PromiseRequest extends EventEmitter {
	constructor() {
		super();
		this.instance = null;
		this.request = this.request.bind(this);
	}

	/**
	 * 单例初始化
	 * @author bubao
	 * @date 2019-12-30
	 * @static
	 * @memberof PromiseRequest
	 */
	static init() {
		if (!this.instance) {
			this.instance = new this();
		}
		return this.instance;
	}

	/**
	 * request
	 * @author bubao
	 * @date 2019-12-30
	 * @param {any} options { pipe, hiden, time, size, readable, ...opts }
	 * @returns {Promise}
	 * @memberof PromiseRequest
	 */
	request(options) {
		const that = this;
		const {
			pipe, // download path
			hiden, // hiden ora
			time, // start time
			size, // download size
			readable, // can be readable
			...opts // request options
		} = options;
		const start = startNum(time);
		let read = getRead(options);
		let response = 0;
		let total = 0;
		let speed = 0;
		let buffer = Buffer.alloc(0);
		const Interval = setInterval(() => {
			that.emit("progress", {
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

PromiseRequest.Downloader = Downloader;
module.exports = PromiseRequest;
