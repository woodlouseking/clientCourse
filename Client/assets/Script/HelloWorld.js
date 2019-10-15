var http = require('http');

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        responstData: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
    },

    // called every frame
    update: function (dt) {

    },

    httpRequest: function() {
        var obj = {
            'url' : 'http://127.0.0.1:8181',
            'success' : function(jsonData) {
                this.responstData.string = jsonData['info'];
            }.bind(this)
        }
        
        http.request(obj);
    },

    toLogin: function() {
        cc.director.loadScene('login');
    },

    toRegister: function() {
        cc.director.loadScene('register');
    },

});
