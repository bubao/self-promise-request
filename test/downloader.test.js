/**
 * @Description:
 * @Author: bubao
 * @Date: 2020-03-10 16:01:02
 * @last author: bubao
 * @last edit time: 2021-05-04 14:44:23
 */
const { Downloader } = require("../");
const ProgressBar = require("../src/progressbar");
const Req = new Downloader();
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const fs = require("fs").promises;

const Bar = ProgressBar.init({ description: "archlinux", bar_length: 25 });

Req.on("progress", Bar.render);

(async () => {
	const states = await fs
		.stat("./archlinux-2020.07-1-archboot-network.iso")
		.catch(() => {});
	Req.request({
		pipe: "./archlinux-2020.07-1-archboot-network.iso",
		read: states ? states.size : undefined,
		uri:
			"http://mirrors.163.com/archlinux/iso/archboot/2020.07/archlinux-2020.07-1-archboot-network.iso"
	});
})();
// (async () => {
// 	const states = await fs
// 		.stat("./000_MagPi%2381_DIGITAL_v3.pdf")
// 		.catch(() => {});
// 	await Req.request({
// 		pipe: "./000_MagPi%2381_DIGITAL_v3.pdf",
// 		read: states ? states.size : undefined,
// 		uri:
// 			"https://www.raspberrypi.org/magpi-issues/000_MagPi%2381_DIGITAL_v3.pdf"
// 	});
// })();
