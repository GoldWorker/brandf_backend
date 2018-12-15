/**
 * lib
 * @authors Your Name (you@example.org)
 * @date    2016-12-14 16:42:09
 * @version $Id$
 */

var fs = require('fs');

exports.mkdirSync = function(url, mode, cb) {
    // var path = require("path");
    var arr = url.split("/");
    mode = mode || 0755;
    cb = cb || function() {};
    if (arr[0] === ".") { //处理 ./aaa
        arr.shift();
    }
    if (arr[0] == "..") { //处理 ../ddd/d
        arr.splice(0, 2, arr[0] + "/" + arr[1])
    }

    function inner(cur) {
    	console.log(cur);
        if (!fs.existsSync(cur)) { //不存在就创建一个
            fs.mkdirSync(cur, mode);
        }
        if (arr.length) {
            inner(cur + "/" + arr.shift());
        } else {
            cb();
        }
    }
    arr.length && inner(arr.shift());
}
