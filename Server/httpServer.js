const http = require('http');
const router = require('./router/router');
const url = require('url');
var userConnMgr = require('./util/userConnMgr');

http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    // 去掉/
    pathname = pathname.replace(/\//g, '');

    var response = {
        'error' : 1,
        'note' : 'Not found path'
    };
    if(router[pathname]) {
        router[pathname](req, res, function(resData) {
            res.write(JSON.stringify(resData));
            res.end();            
        });
    }else{
        res.write(JSON.stringify(response));
        res.end();
    }
}).listen(8181);


var ws = require('nodejs-websocket');

var server = ws.createServer(function (conn) {
    //处理消息
    conn.on('text', function (data) {
        console.log('on test str = ' + data);
        // conn.sendText('from server..');
        router.onSocketMsg(data, conn);
    })
 
    conn.on("close", function (code, reason) {
        userConnMgr.removeByConn(conn);
        console.log("关闭连接");
    })
    conn.on("error", function (code, reason) {
        userConnMgr.removeByConn(conn);
        console.log("异常关闭");
    });
}).listen(8183);
console.log("websocket连接完毕")