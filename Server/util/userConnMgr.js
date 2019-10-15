/*
    用户连接管理
*/
var userConnMgr = {};

var UIDtoConnMap = {};
var connToUIDMap = {};

userConnMgr.add = function(userId, conn) {
    UIDtoConnMap[userId] = conn;
    connToUIDMap[conn] = userId;
}

userConnMgr.removeByUserId = function(userId) {
    var conn = UIDtoConnMap[userId];

    delete connToUIDMap[conn];
    delete UIDtoConnMap[userId];
}

userConnMgr.removeByConn = function(conn) {
    var userId = connToUIDMap[conn];

    delete UIDtoConnMap[userId];
    delete connToUIDMap[conn];
}

userConnMgr.get = function(userId) {
    return UIDtoConnMap[userId];
}

module.exports = userConnMgr;