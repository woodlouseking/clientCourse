var http = require('http');  
var userInfo = {};

var httpTest = function(path, reqData, callBack) {
	var options = {
		hostname : '127.0.0.1',
		port: 8181,
		path: '/' + path + '/?' + reqData,
		method : 'GET'
	}

	var req = http.request(options, function(res){
		console.log('STATUS : ' + res.statusCode);
		res.setEncoding('utf8');
		res.on('data', function(chunk){
			console.log('BODY: ' + chunk);
			callBack && callBack(chunk);
		});
	});

	req.on('error', function(e) {
		console.log('problem with request : ' + e.message);
	});

	req.end();
}

// httpTest('register', 'userName=www&passWord=123', function(body) {
// 	console.log('register come in body = ' + body);
// });

httpTest('login', 'userName=www&passWord=123', function(body){
	var info = JSON.parse(body);
	console.log('login CB = ' + JSON.stringify(info.error));
	if (info.error == 0) {
		userInfo['userId'] = info.data.id;
		userInfo['token'] = info.data.token;
		console.log('userInfo = ' + JSON.stringify(userInfo));
	}
});
