/**
 * c-users
 * @authors Your Name (you@example.org)
 * @date    2016-12-14 23:21:40
 * @version $Id$
 */
var sessions = require("../lib/session.js");
var cookie = require("../lib/cookie.js");
var email = require("../lib/email.js");
var users = require("../model/users.js");

exports.post_login = function(req, res) {
    //登录密码校验
    users.checkPw(req, function(result) {
        if (result) {
            // -----------------------
            // 密码校验成功!!!
            // -----------------------
            var cToken = cookie.get(req, 'token');
            console.log("cToken:\n" + cToken);
            // sessions.check();
            // C->set cookie S->set session
            if (!cookie.checkKey(req, 'token')) {
                // 第一次登陆
                var session = sessions.create({
                    user: result
                });
                cookie.setToken(res, session.id);
                res.end(JSON.stringify({
                    msg: "login success first",
                    token: session.id,
                    name: result.name,
                    user_id: result.id
                }));
            } else {
                // csToken校验
                // 非首次登陆
                console.log("sT:\n" + sessions.get(cToken));
                sessions.check();
                if (sessions.find(cToken)) {
                    res.end(JSON.stringify({
                        msg: "you have been logined",
                        token: sessions.get(cToken).id,
                        name: result.name,
                        user_id: result.id
                    }));
                } else {
                    // 修复损坏的cToken
                    // 重新设置sToken
                    console.log("cookie reset");
                    var session = sessions.create({
                        user: result
                    });
                    cookie.setToken(res, session.id);
                    res.end(JSON.stringify({
                        msg: "login success",
                        token: session.id,
                        name: result.name,
                        user_id: result.id
                    }));
                }
            }
            sessions.check();
        } else res.end(JSON.stringify({
            error: "Plase on sure your user name or password"
        }));
    })
}

exports.post_emailVerify = function(req, res) {
    var data = req.bodyData;
    if (sessions.find(data.email)) {
        // 已发送过邮件
        res.end(JSON.stringify({
            error: "already send email and you can verify again afer one hour"
        }))
    } else {
        var verify_code = generateMixed(32);
        email.send({
            mailAddress: data.email,
            title: "BR&F注册验证码",
            content: "<div><p>欢迎加入BR&F,您的验证码是:</p><p><strong>" + verify_code + "</strong></p><p>请不要将验证码告诉任何人，该邀请码一小时内有效。</p></div>"
        }, function(result) {
            if (result) {
                sessions.createVerify(data.email, {
                    emailVerifyCode: verify_code
                });
                sessions.check();
                res.end(JSON.stringify({
                    msg: "send email success"
                }))
            } else {
                res.end(JSON.stringify({
                    error: "send email failt"
                }))
            }
        })
    }
}

exports.get_logout = function(req, res) {
    var cToken = cookie.get(req, 'token');
    sessions.del(cToken);
    res.end(JSON.stringify({
        msg: "logout success"
    }));
}

exports.post_register = function(req, res) {
    var data = req.bodyData;
    var verify_code = "";
    // 获取session中的验证码
    if (sessions.find(data.email)) {
        verify_code = sessions.get(data.email).data.emailVerifyCode;
    }
    // 验证通过,方允许注册,且默认为visitor权限
    if (verify_code === data.emailVerifyCode) {
        users.register({
            name: data.name,
            password: data.password,
            email: data.email,
            phone: data.phone || ''
        }, function(result) {
            if (result) {
                res.end(JSON.stringify({
                    msg: "register success"
                }));
            } else {
                res.end(JSON.stringify({
                    error: "register failt"
                }));
            }
        });
    } else {
        res.end(JSON.stringify({
            error: "email verify error"
        }));
    }
}

exports.get_keepOnline = function(req, res) {
    var cToken = cookie.get(req, 'token');
    sessions.update(cToken, function(result) {
        if (result) {
            res.end(JSON.stringify({
                msg: "session update success"
            }));
        } else {
            res.end(JSON.stringify({
                error: "place login again"
            }));
        }
    })
}

function generateMixed(n) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}