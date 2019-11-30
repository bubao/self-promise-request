# self-promise-request

自己封装的一个 request，使用 promise，并能监听下载进度。

## 安装

由于并没有 npmjs 的账号，所以只能通过 github 安装，使用 cnpm

```sh
$ cnpm i https://github.com/bubao/self-promise-request.git
# or
$ cnpm i https://github.com/bubao/self-promise-request.git#v0.0.3 --save
```

## 使用

基本用法。

```js
let Req = require("self-promise-request");

const Requests = new Req();
// 使用on函数监听进度
Requests.on("process", res => {
	console.log(res);
});

// request 直接能接收 key value 的参数，和npm的request模块接收的参数一致
Requests.request({ uri: "http://www.baidu.com" });
```
