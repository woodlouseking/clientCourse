var redisDB = {};

var redis = require('redis');
const constData = require('../util/constData');
var client = redis.createClient(8888);

client.on('ready', function(error){
    if (error) {
        console.error('start redis error, ' + error);
        return;
    }

    if (redisDB.get(constData.GLOBAL_USER_ID, function(err, result){
        if(err) {
            console.error('get global_user_id err', err);
            return;
        }
        if (result) {
            // 已经设置过了，退出
            return;
        }

        // 设置起始用户ID
        const startUserId = 1001;
        redisDB.set(constData.GLOBAL_USER_ID, startUserId, null);
    }));
})

client.on('error', function(error) {
    console.log('redis client on error error = ' + error);
})

client.on('connect', function() {
    console.log('redis cliient on connect ');
})

// 字符串的设置操作
redisDB.set = function(key, value, expire, callBack) {
    client.set(key, value, function(err, result) {
        if(err) {
            console.log('redis client set val error = ' + err);
            callBack && callBack(err, false);
            return;
        }

        if(expire && !isNaN(expire) && expire>0) {
            client.expire(key, parseInt(expire));
        }

        callBack && callBack(result);
    })
}

// 获取字符串数据
redisDB.get = function(key, callBack) {
    client.get(key, function(err, result) {
        if (err) {
            console.log('redis client get key error, info : ' + err);
            callBack && callBack(err, false);
            return;
        }

        callBack && callBack(0, result);
    })
}

// 增加用户ID
redisDB.incrby = function(key, incrNum, callBack) {
    client.incrby(key, incrNum, function(err, number) {
        console.info('incrby key = ' + key + '  incrNum = ' + incrNum);
        callBack && callBack(err, number);
    })
}

// 哈希操作
redisDB.hset = function(key, filed, val, callBack) {
    client.hset(key, filed, val, function(err, result) {
        if (err) {
            console.log('redis clien hset ser val error = '  + err);
            callBack && callBack(err, false);
            return;
        }

        callBack && callBack(0, result);
    });
}

redisDB.hget = function(key, filed, callBack) {
    client.hget(key, filed, function(err, result) {
        if (err) {
            console.log('redis client hget val error = ' + err);
            callBack && callBack(err, false);
            return;
        }

        callBack && callBack(0, result);
    })
}

/* 
    将多个 field-value (字段-值)对设置到哈希表中
    redisDB.hmset('u1002', {'name':'haha2', 'age':2});
*/
redisDB.hmset = function(key, args, callBack) {
    client.hmset(key, args, function(err, result) {
        if (err) {
            console.log('hmset error = ' + err);
            callBack && callBack(err, false);
            return;
        }
        
        callBack && callBack(0, result);
    })
}

/*
    获取多个field值
    redisDB.hmget('u1002', ['age', 'name'], function(err, result) {

    });
*/
redisDB.hmget = function(key, args, callBack) {
    client.hmget(key, args, function(err, result) {
        if (err) {
            console.log('hmget error = ' + err);
            callBack && callBack(err, false);
            return;
        }

        callBack && callBack(0, result);
    })
}

module.exports = redisDB;