/**
 * session
 * @authors Your Name (you@example.org)
 * @date    2016-12-17 00:36:47
 * @version $Id$
 */
var sessions = {};
var key = 'session_id';
// 清理间隔
var __INTERVAL__ = 60 * 1000 * 30;
// session过期延时
var EXPIRES = 60 * 1000 * 60;

exports.create = function(data) {
    var session = {};
    var nowTime = (new Date()).getTime();
    session.id = nowTime + Math.random();
    session.cookie = {
        expires: nowTime + EXPIRES
    }
    if (data) {
        session.data = data;
    }
    sessions[session.id] = session;
    return session;
}

// 定制化session
exports.createVerify = function(key, data) {
    var session = {}
    var nowTime = (new Date()).getTime();
    session.id = key;
    session.cookie = {
        expires: nowTime + EXPIRES
    }
    session.data = data;
    sessions[key] = session;
    return session;
}

exports.check = function() {
    console.log("SESSION CHECK:\n" + JSON.stringify(sessions));
}

exports.get = function(key) {
    if (sessions[key] != undefined)
        return sessions[key];
    return false;
}

exports.find = function(key) {
    if (sessions[key] != undefined)
        return true;
    return false;
}

exports.del = function(key) {
    if (sessions[key] != undefined)
        delete sessions[key];
}

exports.update = function(id, callback) {
    if (sessions[id] != undefined) {
        sessions[id].cookie.expires = (new Date()).getTime() + EXPIRES;
        callback && callback(true);
    } else {
        callback && callback(false);
    }
}

// session过期策略
var __SESSION_TIMER__ = setInterval(function() {
    var nowTime = (new Date()).getTime();
    for (var elem in sessions) {
        // console.log(elem.cookie.expires)
        if (nowTime > sessions[elem].cookie.expires) {
            delete sessions[sessions[elem].id]
            console.log("SESSION CHECK:\n" + JSON.stringify(sessions));
        }
    }
}, __INTERVAL__)