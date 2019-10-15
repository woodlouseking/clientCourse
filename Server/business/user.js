/*
    File : user.js
    Function : 用户相关的逻辑
*/
const redisDB = require('../db/redis');
const constData = require('../util/constData');

var user = {};

user.createUser = function(userName, passWord, callBack) {
    
    var createUser = function(userId) {
         // 获取到用户ID后创建用户
         var userKey = constData.USER_BASEK_KEY + userId;
         var userData = {
             'name' : userName,
             'passWord' : passWord,
             'coin' : 0,
             'diamond' : 0,
             'head' : '',
             'friends':[]
         }

        //  数据库创建用户
         redisDB.hmset(userKey, userData, function(err, result) {
             var data = {
                 'userId' : userId,
                 'name' : userName,
                 'token' : ''
             }

            //  创建用户名和id的映射
            redisDB.hset(constData.UNAME_UID_MAP_KEY, userName, userId);

             if(err) {
                data = {
                    'error' : err,
                    'note' : 'create user error!!'
                }
                callBack(data);
                return;
             }
             callBack(data);
         })
    }

    var getUserId = function() {
        redisDB.incrby(constData.GLOBAL_USER_ID, 1, function(err, userId) {
            if(err) {
                var data = {
                    'error' : err,
                    'note' : 'create user error!!'
                }
                callBack(data);
                return;
            }
    
            createUser(userId);
        });
    }

    // 检验用户名是否存在
    redisDB.hget(constData.UNAME_UID_MAP_KEY, userName, function(err, result) {
        if(result) {
            data = {
                'error' : 1,
                'note' : 'UserName exist'
            }
            callBack && callBack(data);
            return;
        }
        
        getUserId();
    });
}

user.login = function(userName, passWord, callBack) {
    redisDB.hget(constData.UNAME_UID_MAP_KEY, userName, function(err, userId) {
        if(!userId) {
            data = {
                'error' : 1,
                'note' : 'UserName not exist'
            }
            callBack && callBack(data);
            return;
        }

        // 获取用户
        var userKey = constData.USER_BASEK_KEY + userId;
        var dataElements = ['passWord', 'name', 'coin', 'diamond', 'head', 'friends'];
        redisDB.hmget(userKey, dataElements, function(err, result) {
            if (err) {
                var data  = {
                    'error' : 1,
                    'note' : 'get userinfo error!'
                }
                callBack && callBack(data);
                return;
            }

            //判断用户密码是否相同
            var userData = {};
            for(var i=0, l=dataElements.length; i<l; i++) {
                userData[dataElements[i]] = result[i];
            }
            // 设置用户token
            userData['token'] = setToken(userId);
            userData['id'] = userId;

            console.log('r p = ' + userData['passWord'] + '  u p = ' + passWord);

            if(userData['passWord'] == passWord) {
                // 删除返回数据中的密码
                delete userData['passWord'];

                var data = {
                    'error' : 0,
                    'data' : userData
                }
                callBack && callBack(data);
                return;
            }
            data = {
                'error' : 1,
                'note' : 'Error password'
            }
            callBack && callBack(data);
        });
    });
}

user.checkToken = function(userId, token, callBack) {
    // 检测用户的token
    redisDB.hget(constData.USER_TOKEN_KEY, userId, function(err, data) {
        if (err) {
            callBack && callBack(false);
            return;
        }
        
        callBack && callBack(token == data);
    })
}

var randomInt = function() {
    return Math.ceil(Math.random() * 9999999);
}

var formatDate = function() {
    var d = new Date();
    return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay() + ' ' + d.getHours()+':'+d.getMinutes()+':'+d.getSeconds() + ' ' + d.getMilliseconds();
}

var setToken = function(userId) {
    var token = '' + randomInt() + '|' + userId + '|' + randomInt() + '|' + formatDate() + '|' + randomInt();
    redisDB.hset(constData.USER_TOKEN_KEY, userId, token);
    return token;
}

module.exports = user;