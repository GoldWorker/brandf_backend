/**
 * lib
 * @authors Your Name (you@example.org)
 * @date    2016-12-14 16:42:09
 * @version $Id$
 */

exports.log = function(content) {
    //将arguments这个非标准数组对象转化为组织对象
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[Debug]: ');
    console.log.apply(console, args);
}

exports.trim = function(string) {
    return string.replace(/(^\s*)|(\s*$)/g, "");
}