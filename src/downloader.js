/**
 * @Description:
 * @Author: bubao
 * @Date: 2020-03-10 18:56:45
 * @last author: bubao
 * @last edit time: 2021-02-06 16:56:48
 */
const EventEmitter = require("events");
const Request = require("request");
const { getRead, getLength, getTotal, startNum } = require("../utils/index");
const fs = require("fs");

class Downloader extends EventEmitter {
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
	 * @param {{
	 * pipe:string, // download path
	 * hide:boolean, // hiden ora
	 * time:number, // start time
	 * size:number, // download size content-length
	 * }} options { pipe, hiden, time, size, readable, ...opts }
	 * @returns {Promise}
	 * @memberof PromiseRequest
	 */
	request(options) {
		const that = this;
		const {
			pipe, // download path
			hiden, // hiden ora
			time, // start time
			size, // download size content-length
			...opts // request options
		} = options;
		const start = startNum(time);
		let read = getRead(options);
		let response = 0;
		let total = 0;
		let speed = 0;

		const res = Request(opts);
		const Interval = setInterval(() => {
			that.emit("progress", {
				completed: read,
				total,
				hiden,
				speed,
				time: { start },
				status: { down: "正在下载...", end: "完成\n" }
			});
			speed = 0;
		}, 1000);
		read && res.setHeader("Range", `bytes=${read}-`);

		return new Promise(function(resolve) {
			res.on("response", resp => {
				const length = resp.headers["content-length"];
				response = getLength(
					read && length !== undefined
						? read + (length - 0)
						: length,
					size
				);
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
					resolve();
				});
			// 如果 pipe参数存在，则下载到指定路径
			download(res, pipe, read);
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
module.exports = Downloader;
