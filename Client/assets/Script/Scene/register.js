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

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        passWordErrorHintLabel: {
            default: null,
            type: cc.Label
        },
        userNameErrorHintLabel: {
            default: null,
            type: cc.Label
        },
        registerSuccessLabel: {
            default: null,
            type: cc.Label
        },
        registerInfoNode: {
            default: null,
            type: cc.Node
        },
        userName: '',
        passWd: '',
        rePassWd : ''
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
        console.log('reinput correct 000 ... this.passWd = ' + this.passWd);
    },

    reInputPWEnded: function(editbox, customEventData) {
        this.rePassWd = editbox.string;
        if (this.passWd == this.rePassWd) {
            return;
        }

        this._showErrorHint(this.passWordErrorHintLabel);
    },

    _showErrorHint: function(label) {
        this.passWordErrorHintLabel.node.active = false;
        this.userNameErrorHintLabel.node.active = false;

        // 显示提示
        label.node.active = true;

        // 设置计时器
        this.scheduleOnce(function(){
            label.node.active = false;
        }.bind(this), 2);
    },

    onRegister: function() {
        if (!this.userName || this.userName.length<1) {
            this._showErrorHint(this.userNameErrorHintLabel);
            return;
        }

        if (!this.passWd || this.passWd.length<1) {
            this._showErrorHint(this.passWordErrorHintLabel);
            return;
        }

        if (this.passWd != this.rePassWd) {
            this._showErrorHint();
        }

        this._startRegister();
    },

    // 发起请求
    _startRegister: function() {
        var obj = {
            'url' : Constant.REGISTER_URL,
            'data' : {
                'userName' : this.userName,
                'passWord' : this.passWd
            },
            'success' : function(jsonData) {
                this._onRegisterSuccess(jsonData);
            }.bind(this),

            'fail' : function() {
                this._onRegisterFail(jsonData);
            }.bind(this)

        }
        
        http.request(obj);
    },

    _onRegisterSuccess: function(jsonData) {
        this.registerInfoNode.active = true;
        if (jsonData.error) {
            // 注册出错
            this.registerSuccessLabel.string = jsonData['note'];
            return;
        }
        console.log('_onRegisterSuccess come in jsonData = ' + JSON.stringify(jsonData));
        var info = '注册成功\n用户名：' + jsonData['name'] + '\n用户ID：'+ jsonData['userId'] + '\n牢记自己的信息\n';
        console.log('info = ' + info);
        this.registerSuccessLabel.string = info;
    },

    _onRegisterFail: function(jsonData) {
        console.log('_onRegisterFail come in jsonData = ' + JSON.stringify(jsonData));
    },

    back: function() {
        cc.director.loadScene('helloworld');
    },

    // update (dt) {},
});
