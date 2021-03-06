/**
 * @Description: ProgressBar 命令行进度条
 * @Author: bubao
 * @Date: 2018-03-15 16:14:55
 * @last author: bubao
 * @last edit time: 2021-02-06 16:36:47
 */
const { slog, clicolor, time, byteSize } = require("../utils");

/**
 * ProgressBar 命令行进度条
 * @param {string} description 命令行开头的文字信息
 * @param {number} bar_length 进度条的长度(单位：字符)，默认设为 25
 */
class ProgressBar {
	/**
	 *Creates an instance of ProgressBar.
	 * @param {any} [props={}] {description:"命令行开头的文字信息",bar_length:进度条的长度(单位：字符)，默认设为 25}
	 * @memberof ProgressBar
	 */
	constructor(props = {}) {
		this.description = props.description || "Progress"; // 命令行开头的文字信息
		this.length = props.bar_length || 25; // 进度条的长度(单位：字符)，默认设为 25
		this.description = clicolor.blue.bold(this.description);
		this.render = this.render.bind(this);
		this.instance = null;
	}

	/**
	 * 初始化参数
	 * @static
	 * @param {any} [props={}] {description:"命令行开头的文字信息",bar_length:进度条的长度(单位：字符)，默认设为 25}
	 * @memberof PromiseRequest
	 */
	static init(props = {}) {
		if (!this.instance) {
			this.instance = new this(props);
		} else {
			this.description = props.description || this.description; // 命令行开头的文字信息
			this.length = props.bar_length || this.bar_length; // 进度条的长度(单位：字符)，默认设为 25
			this.description = clicolor.blue.bold(this.description);
		}

		return this.instance;
	}

	init(props) {
		this.description = props.description || this.description; // 命令行开头的文字信息
		this.length = props.bar_length || this.bar_length; // 进度条的长度(单位：字符)，默认设为 25
		this.description = clicolor.blue.bold(this.description);
	}

	/**
	 * @description 渲染进度条
	 * @author bubao
	 * @param {{
	 * completed:number, // (已完成)
	 * total:number, // (总量)
	 * hiden:boolean, // (隐藏)
	 * speed:number, // (下载速度)
	 * status:{down:string},// (下载时文字)
	 * status:{end:string},// (完成时的文字)
	 * }} opts
	 * @memberof ProgressBar
	 */
	render(opts) {
		const percent = (opts.completed / opts.total).toFixed(4); // 计算进度(子任务的 完成数 除以 总数)
		const cellNum = Math.floor(percent * this.length); // 计算需要多少个 █ 符号来拼凑图案
		// 拼接黑色条
		let cell = "";
		for (let i = 0; i < cellNum; i += 1) {
			cell += "█";
		}

		// 拼接灰色条
		let empty = "";
		for (let i = 0; i < this.length - cellNum; i += 1) {
			empty += "░";
		}

		cell = clicolor.green.bgBlack.bold(cell);
		opts.completed = clicolor.yellow.bold(byteSize(opts.completed));
		opts.total = clicolor.blue.bold(byteSize(opts.total));
		this.status =
			(100 * percent).toFixed(2) === "100.00"
				? opts.status.end || "正在下载"
				: opts.status.down || "已完成";
		// 拼接最终文本
		const cmdText = `${this.description}:  ${(100 * percent).toFixed(
			2
		)}% ${cell} + ${empty} ${opts.completed}/${opts.total}  ${time(
			new Date().valueOf() / 1000 - parseInt(opts.time.start / 1000, 10)
		)} ${opts.speed ? byteSize(opts.speed) + "/s" : ""} ${this.status}`;

		if ((100 * percent).toFixed(2) !== "100.00" || !opts.hiden) {
			slog(cmdText);
		} else {
			slog("");
		}
	}
}

module.exports = ProgressBar;
