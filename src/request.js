/**
 * @Description:
 * @Author: bubao
 * @Date: 2018-11-21 22:52:36
 * @last author: bubao
 * @last edit time: 2021-03-05 03:31:11
 */
const EventEmitter = require("events");
const Request = require("request");
const { getRead, getLength, getTotal, startNum } = require("../utils/index");

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
	request(options, cb) {
		const that = this;
		const {
			pipe, // download path
			hiden, // hiden ora
			time, // start time
			size, // download size
			...opts // request options
		} = options;
		const start = startNum(time);
		let read = getRead(options);
		let response = 0;
		let total = 0;
		let speed = 0;

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
			const res = Request(opts, function(error, res, body) {
				resolve({
					error,
					response: res,
					body,
					read
				});
			})
				.on("response", resp => {
					const length = resp.headers["content-length"];
					response = getLength(
						read && length !== undefined
							? read + (length - 0)
							: length,
						size
					);
					if (typeof cb === "function") cb(resp, res);
				})
				.on("data", function(data) {
					speed += data.length;
					read += data.length;
					total = getTotal(
						size,
						response,
						read
					);
				})
				.on("end", () => {
					that.emit("progress", {
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

module.exports = PromiseRequest;
