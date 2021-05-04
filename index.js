/**
 * @Description:
 * @Author: bubao
 * @Date: 2018-11-21 22:52:36
 * @last author: bubao
 * @last edit time: 2021-05-04 14:38:56
 */
const Downloader = require("./src/downloader");
const PromiseRequest = require("./src/request");

PromiseRequest.Downloader = Downloader;
module.exports = PromiseRequest;
