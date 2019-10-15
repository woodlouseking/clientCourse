/*
 File : Constant.js
 Function : 常量定义
 */

var Constant = {};

var baseURL = 'http://127.0.0.1:8181/';
Constant.REGISTER_URL = baseURL + 'register/';
Constant.LOGIN_URL = baseURL + 'login/';

Constant.wsUrl = 'ws://127.0.0.1:8183/';

module.exports = Constant;