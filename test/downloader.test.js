/**
 * @Description:
 * @Author: bubao
 * @Date: 2020-03-10 16:01:02
 * @LastEditors: bubao
 * @LastEditTime: 2020-04-13 19:13:37
 */
const Downloader = require("../src/downloader");
const ProgressBar = require("../src/progressbar");
const Req = new Downloader();
const Bar = ProgressBar.init({ description: "archlinux", bar_length: 25 });

Req.on("progress", Bar.render);
Req.request({
	pipe: "./archlinux-2020.03.01-x86_64.iso",
	uri:
		"http://mirrors.163.com/archlinux/iso/2020.03.01/archlinux-2020.03.01-x86_64.iso"
});
