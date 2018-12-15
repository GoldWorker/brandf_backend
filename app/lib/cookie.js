/**
 * cookie
 * @authors Your Name (you@example.org)
 * @date    2016-12-17 15:32:15
 * @version $Id$
 */

var lib = require("../lib/lib.js");

exports.set = function(res, arr) {
    res.setHeader('Set-Cookie', arr);
    return res;
}

exports.setToken = function(res, token) {
    var date = new Date();
    var expireDays = 10;
    //将date设置为10min以后的时间
    date.setTime(date.getTime() + expireDays * 60 * 1000 * 60);
    res.writeHead(200, {
        'Set-Cookie': " token=" + token + "; Expires=" + date.toUTCString() + "; path=/",
        'Content-Type': 'text/html'
    });
    console.log("EXPIRES TIME:\n" + date.toUTCString())
    return res;
}

exports.get = function(req, key) {
    if (req.headers.cookie) {
        var cookies = req.headers.cookie.split(';');
        // console.log(cookies)
        for (var i = cookies.length - 1; i >= 0; i--) {
            //去除两端空格
            cookies[i] = lib.trim(cookies[i]);
            var arr = cookies[i].split('=');
            // console.log(arr[0] + '\n')
            if (arr[0] == key) {
                console.log("COOKIE GET:\n" + arr[1]);
                return arr[1];
            }
        }
        return false;
    } else false;
}

exports.checkKey = function(req, key) {
    if (req.headers.cookie) {
        var cookies = req.headers.cookie.split(';');
        // console.log(cookies)
        for (var i = cookies.length - 1; i >= 0; i--) {
            //去除两端空格
            cookies[i] = lib.trim(cookies[i]);
            var arr = cookies[i].split('=');
            // console.log(arr[0] + '\n')
            if (arr[0] == key) {
                return true;
            }
        }
        return false;
    } else false;
}
