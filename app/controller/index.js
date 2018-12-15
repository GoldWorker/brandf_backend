/**
 * c-index
 * @authors Your Name (you@example.org)
 * @date    2016-12-14 23:21:40
 * @version $Id$
 */
var sessions = require("../lib/session.js");
var cookie = require("../lib/cookie.js");
var email = require("../lib/email.js");
var article = require("../model/article.js");
// var mysql = require("mysql");

exports.get = function(req, res, args) {
    var param = Array.prototype.slice.call(arguments);
    param = param.slice(2);
    console.log("P:" + param);
    //登录校验
    if (!cookie.checkKey(req, 'sid')) {
        var session = sessions.create();
        // res.writeHead(200, {
        //     'Content-Type': 'text/plain',
        //     'Set-Cookie': 'sid=' + session.id + ';path="/";Expires=' + (new Date()).getTime() + ';httpOnly=true'
        // });
        cookie.set(res, ['sid=' + session.id, 'test=asdasd']);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
    } else {
        console.log('session is setted');
        // console.log(req.headers.cookie)
        console.log(cookie.get(req, 'sid'));
        sessions.check();
    }
    // email.sendMail("695508580@qq.com", "测试", "Hello Work");
    res.end("get index");
}

exports.post = function(req, res, args) {
    var param = Array.prototype.slice.call(arguments);
    param = param.slice(2);
    console.log(param);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("post index");
}
