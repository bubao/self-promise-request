/**
 * @Description:
 * @Author: bubao
 * @Date: 2020-03-10 18:56:45
 * @LastEditors: bubao
 * @LastEditTime: 2020-03-10 21:11:47
 */
const EventEmitter = require("events");
const Request = require("request");
const { getRead, getLength, getTotal, startNum } = require("../utils/index");
const fs = require("fs");

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
	 * @returns　this
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
			const res = Request(opts)
				.on("response", resp => {
					console.log(resp.headers);
					response = getLength(resp.headers["content-length"], size);
				})
				.on("data", function(data) {
					speed += data.length;
					read += data.length;
					total = getTotal(size, response, read);
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
					resolve();
				});
			// 如果 pipe参数存在，则下载到指定路径
			download(res, pipe);
		});
	}
}

/**
 * 如果存在piep则下载
 * @author bubao
 * @date 2019-12-30
 * @param {buffer} data stream
 * @param {string} dir pipe
 */
function download(data, dir) {
	if (dir && dir.length) data.pipe(fs.createWriteStream(dir || "./"));
}
module.exports = PromiseRequest;
