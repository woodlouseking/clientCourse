/*
  File : protocol.js
  Function : 协议
 */

var protocolData = {};
var userData = require('userData');

protocolData.bindData = function() {
	return {
		'operate' : 'bind',
		'data' : {
			'userId' : userData.userId,
			'token' : userData.token
		}
	}
}

module.exports = protocolData;
