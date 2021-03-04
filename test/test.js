/**
 * @description:
 * @author: bubao
 * @date: 2020-07-08 01:46:42
 * @last author: bubao
 * @last edit time: 2021-03-05 03:27:43
 */
const Req = require("../");

const Requests = new Req();

// const Requests = Req.init();

Requests.on("progress", data => {
	console.log(data);
});

Requests.request({
	url: "https://baidu.com"
	// pipe: "./1.html"
}).then(data => {
	console.log(data);
});
