# self-promise-request

自己封装的一个request，使用promise，并能监听下载进度。

## 安装

由于并没有npmjs的账号，所以只能通过github安装，使用cnpm

```sh
$ cnpm i https://github.com/bubao/self-promise-request.git
# or
$ cnpm i https://github.com/bubao/self-promise-request.git#v0.0.1 --save
```

## 使用

基本用法。

```js
let {request , on } = require("self-promise-request");

// request 直接能接收 key value 的参数，和npm的request模块接收的参数一致
request({uri:"http://www.baidu.com"});

//调用了 request 方法之后，就能使用on函数监听进度
on("process",(res)=>{
    console.log(res);
})

```