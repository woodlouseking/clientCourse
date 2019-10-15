/*
 用户数据
 */

var userData = {};

userData.token = '';
userData.userId = null;

userData.setData = function(id, token) {
	userData.token = token;
	userData.userId = id;
}

module.exports = userData;