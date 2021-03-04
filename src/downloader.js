/**
 * @Description:
 * @Author: bubao
 * @Date: 2020-03-10 18:56:45
 * @last author: bubao
 * @last edit time: 2021-03-05 03:18:09
 */
const PromiseRequest = require("./request");
const { getRead } = require("../utils/index");
const fs = require("fs");

class Downloader extends PromiseRequest {
	constructor() {
		super();
		this.instance = null;
		this.request = this.request.bind(this);
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
		// let response = 0;
		const read = getRead(options);
		options.headers = { ...options.headers, Range: `bytes=${options.read || 0}-` };
		super.request(options, (resp, res) => {
			let range = 0;
			if (resp.headers && resp.headers["content-range"]) {
				range = Number(resp.headers["content-range"].split("/").pop());
			}
			// 如果 pipe参数存在，则下载到指定路径
			if (range > 0 && range - read) download(res, options.pipe, read);
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
