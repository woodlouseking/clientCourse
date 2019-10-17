/*
    File : route.js
    Function : 路由处理
*/
const url = require('url');
const user = require('../business/user');
var userConnMgr = require('../util/userConnMgr');

var router = {};

var getParams = function(req) {
    // 获取请求参数
    var params = url.parse(req.url).query;
    if(!params) {
        return {};
    }
    var paramList = params.split('&');
    var res = {};
    for(var i=0, l=paramList.length; i<l; i++) {
        var elements = paramList[i].split('=');
        res[elements[0]] = elements[1];
    }
    
    return res;
}

router.register = function(req, res, callBack) {
    var params = getParams(req);
    // 参数校验 todo...
    user.createUser(params['userName'], params['passWord'], function(data) {
        callBack && callBack(data);
    })
}

router.login = function(req, res, callBack) {
    var params = getParams(req);
    if(!params || !params['userName']) {
        var res = {'error' : 1, 'note':'no params'};
        callBack && callBack(res);
        return;
    }
    //登录
    user.login(params['userName'], params['passWord'], function(data) {
        callBack && callBack(data);
    })
}


// socket 协议
var socketHander = {};
router.onSocketMsg = function(initData, conn) {
    var data = null;
    try{
        data = JSON.parse(initData);
    }catch(e) {
        console.log('parse json error , ', e);
        conn.sendText('parse data error');
        return;
    }
    // 检测token
    user.checkToken(data['data']['userId'], data['data']['token'], function(res) {
        console.log('checkToken come in res = ' + res);
        if(!res) {
            var resdata = {
                'operate':data['operate'],
                'data' : {
                    'error': 1,
                    'info' : 'token is error!!'
                }
            }
            conn.sendText(JSON.stringify(resdata));
            return;
        }

        // 进行分发
        socketHander[data['operate']](data['data'], conn)
    });
}

socketHander.bind = function(data, conn) {
    var userId = data['userId'];
    userConnMgr.add(userId, conn);
}


module.exports = router;