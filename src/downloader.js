/**
 * @description:
 * @author: bubao
 * @date: 2021-05-04 14:12:25
 * @last author: bubao
 * @last edit time: 2021-05-04 14:42:39
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
		opts.headers = { ...opts.headers, Range: `bytes=${options.read || 0}-` };

		let Interval = () => { };
		return new Promise(function(resolve, reject) {
			const res = Request(opts)
				.on("response", resp => {
					const length = resp.headers["content-length"];
					response = getLength(
						read && length !== undefined
							? read + (length - 0)
							: length,
						size
					);
					Interval = setInterval(() => {
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
					let range = 0;
					if (resp.headers["content-range"]) {
						range = Number(resp.headers["content-range"].split("/").pop());
					}
					// 如果 pipe参数存在，则下载到指定路径
					if (range > 0 && range - read) download(res, pipe, read);
				})
				.on("data", function(data) {
					speed += data.length;
					read += data.length;
					total = getTotal(
						size,
						response,
						read
					);
				}).on("error", error => {
					reject(error);
					clearInterval(Interval);
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
					resolve();
					clearInterval(Interval);
				});
		});
	}
}

/**
 * 如果存在piep则下载
 * @author bubao
 * @date 2019-12-30
 * @param {buffer} data stream
 * @param {string} dir pipe
 * @param {boolean} append
 */
function download(data, dir, append) {
	if (dir && dir.length) {
		const opts = append ? { flags: "a" } : undefined;
		data.pipe(fs.createWriteStream(dir || "./", opts));
	}
}

module.exports = PromiseRequest;
