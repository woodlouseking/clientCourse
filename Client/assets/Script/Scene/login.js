// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var http = require('http');
var Constant = require('Constant');
var socket = require('socket');
var userData = require('userData');

cc.Class({
    extends: cc.Component,

    properties: {
        passWordOrUserNameIsNull: {
            default: null,
            type: cc.Label
        },
        passWordErrorHint: {
            default: null,
            type: cc.Label
        },
        userName: '',
        passWd: ''
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    inputUserNameEnded: function(editbox, customEventData) {
        this.userName = editbox.string;
    },

    inputPassWordEnded: function(editbox, customEventData) {
        this.passWd = editbox.string;
    },

    _showErrorHint: function(label) {
        this.passWordErrorHint.node.active = false;
        this.passWordOrUserNameIsNull.node.active = false;

        // 显示提示
        label.node.active = true;

        // 设置计时器
        this.scheduleOnce(function(){
            label.node.active = false;
        }.bind(this), 2);
    },

    onLogin: function() {
        if (!this.userName || this.userName.length<1) {
            console.log('onLogin come in 000');
            this._showErrorHint(this.passWordOrUserNameIsNull);
            return;
        }

        if (!this.passWd || this.passWd.length<1) {
            console.log('onLogin come in 001 this.passWd = ' + this.passWd);
            this._showErrorHint(this.passWordErrorHint);
            return;
        }

        this._startLogin();
    },

    // 发起请求
    _startLogin: function() {
        var obj = {
            'url' : Constant.LOGIN_URL,
            'data' : {
                'userName' : this.userName,
                'passWord' : this.passWd
            },
            'success' : function(jsonData) {
                this._onLoginSuccess(jsonData);
            }.bind(this),

            'fail' : function() {
                this._onLoginFail(jsonData);
            }.bind(this)

        }
        
        http.request(obj);
    },

    _onLoginSuccess: function(jsonData) {
        // 设置用户信息
        userData.setData(jsonData['data']['id'], jsonData['data']['token']);
        // 登录成功后开始创建长连接
        var s = new socket();
    },

    _onLoginFail: function(jsonData) {
        console.log('_onLoginFail come in jsonData = ' + JSON.stringify(jsonData));
    },

    back: function() {
        cc.director.loadScene('helloworld');
    },

    // update (dt) {},
});
