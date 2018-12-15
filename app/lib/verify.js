/**
 * lib-login
 * @authors Your Name (you@example.org)
 * @date    2017-01-27 12:39:03
 * @version $Id$
 */
var url = require('url');
var debug = require('./lib.js');
var sessions = require("../lib/session.js");
var cookie = require("../lib/cookie.js");
// path|GET|POST|DELETE|PUT
// 接口管理
// 白名单策略
var __WHITE_LIST__ = ["/", "/index", "/users/login|POST", "/users/register|POST", "/users/logout", "/users/keepOnline", "/users/register", "/article/once", "/article/all", "/article/page", "/crawler/weibo", "/users/emailVerify|POST", "/comment/normal", "/java|POST", "/component/conf"];
var __POWER_GROUP__ = {
    master: 'all',
    visitor: ["/comment/normal|POST", "/comment/reply|POST"],
    friend: ["/comment/reply|POST", "/comment/reply|POST", "/article|POST"]
}

exports.check = function (req, callback) {
    var path = url.parse(req.url).pathname;
    var elems = path.split('/');
    var elem = '/';
    if (elems[1]) {
        var elem = '/' + elems[1];
    }
    if (elems[1] && elems[2]) {
        var elem = '/' + elems[1] + '/' + elems[2];
    }
    // 能通过白名单则无需检验Token
    if (inList(elem, __WHITE_LIST__, req.method)) {
        return callback(true);
    } else {
        // check Token
        var cToken = cookie.get(req, 'token');
        // console.log("cToken:\n" + cToken);
        if (sessions.find(cToken)) {
            // 检查权限列表
            var power = sessions.get(cToken).data.user.power || null;
            if (inList(elem, __POWER_GROUP__[power], req.method) || power == 'master') {
                return callback(true);
            }
            return callback(false);
        }
        return callback(false);
    }
}

function inList(elem, arr, med) {
    for (var i = arr.length - 1; i >= 0; i--) {
        var item = arr[i].split('|');
        var path = item[0];
        item.shift();
        var methods = item;
        // 默认放行get
        methods.push('GET')

        if (elem == path && inArray(med, methods)) {
            return true;
        }
    }
    // console.log("connot pass whileList\n")
    return false;
}

function inArray(elem, arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elem) {
            return true;
        }
    }
    return false;
}