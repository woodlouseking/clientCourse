var ws = require('ws');
var wsUrl = 'ws://127.0.0.1:8183/';

var sock = new ws(wsUrl);

sock.on('open', function() {
	console.log('sock open come in ...');
	sock.send('hello world ..');
});

sock.on('error', function(err) {
	console.log('sock error come in ...', err);
});

sock.on('close', function(err){
	console.log('sock close come in ..');
});

sock.on('message', function(data){
	console.log('sock get message data = ', data);
});