const Req = require("../");

// const Requests = new Req();

const Requests = Req.init();

Requests.on("process", data => {
	console.log(data);
});

Requests.request({
	url: "https://baidu.com",
	pipe: "./1.html"
});
