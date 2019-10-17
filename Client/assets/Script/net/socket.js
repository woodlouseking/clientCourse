var protocolData = require('protocolData');
var Constant = require('Constant');

var socket = cc.Class({
    ctor: function() {
        var ws = new WebSocket(Constant.wsUrl);
        var self = this;
        // 发起连接
        ws.onopen = function (event) {
            console.log('ws test 000 Send Text WS was opened.');
            self._onOpne();
        };
        ws.onmessage = function (event) {
            console.log('ws test 001 response text msg: ' + event.data);
        };
        ws.onerror = function (event) {
            console.log('ws test 002 Send Text fired an error event = ' + event);
        };
        ws.onclose = function (event) {
            console.log('ws test 003 WebSocket instance closed. event = ' + event);
            that._ws = null;
        };

        this._ws = ws;
    },

    send: function(data) {
        if (!this._ws) {
            console.error('ws is closed');
            return;
        }

        var sd = JSON.stringify(data);
        console.log('ws send data = ' + sd);
        this._ws.send(sd);
    },

    _onOpne: function() {
        // 发送绑定协议
        this.send(protocolData.enter());
    },
});
module.exports = socket;