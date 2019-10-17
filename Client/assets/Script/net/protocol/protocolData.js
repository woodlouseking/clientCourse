/*
  File : protocol.js
  Function : 协议
 */

var protocolData = {};
var userData = require('userData');

protocolData.enter = function() {
	return {
		'opr' : 'enter',
		'data' : {
			'userId' : userData.userId,
			'token' : userData.token
		}
	}
}

module.exports = protocolData;
