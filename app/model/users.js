/**
 * model-article
 * @authors Flyteng (you@example.org)
 * @date    2017-01-20 13:26:12
 * @version $Id$
 */
var mysql = require("mysql");
var pool = require("../lib/sqlConfig.js").pool;
var async = require('async');
var DB = require("../lib/sqlConfig.js").DB;
/**
 * add article
 * @param {[type]} status  [0/1 sava/publish]
 * @param {[type]} content []
 */

exports.checkPw = function(req, callback) {
    var user = req.bodyData;
    console.log('LOGIN_INFO:\n' + user.email + '\n' + user.password)
    if (user.email && user.password) {
        var loginSQL = 'select * from users where email=?';
        var inserts = [],
            result = {};
        inserts.push(user.email);
        var sql = mysql.format(loginSQL, inserts);
        // sql 连接池连接
        // 事务部分
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            var query = connection.query(sql);
            query
                .on('error', function(err) {
                    console.log("ERROR:\n" + err.code);
                    if (err) throw err;
                })
                .on('result', function(rows) {
                    result = rows;
                    // console.log('Reslut is\n', rows);
                })
                .on('end', function() {
                    console.log('connect end success\n');
                    // 检验pw的存在并校对
                    if (result.password == user.password) {
                        callback(result);
                    } else callback(false);
                    connection.release();
                });
        });
    } else callback(false);
}

exports.register = function(data, callback) {
    console.log(data)
    var email_query = "select email from users where email=?"
    var sql_query = "insert into users (name, password, email, phone, date) values (?,?,?,?,?)"
    var date = getDate();
    if (data.name && data.password && data.email) {
        var tasks = [function(cb) {
            DB.query(email_query, [data.email], function(err, rows) {
                if (err) throw err
                console.log(rows)
                if (rows.length)
                    cb(err, false)
                else cb(err, true)
            })
        }, function(bool, cb) {
            if (bool) {
                DB.query(sql_query, [data.name, data.password, data.email, data.phone, date], function(err, rows) {
                    if (err) {
                        throw err
                        console.log(err)
                        cb(false)
                    } else cb(true)
                })
            } else cb(false)
        }]
        async.waterfall(tasks, function(result) {
            if (result)
                callback && callback(true);
            else callback && callback(false);
        })

    } else callback && callback(false);
}

exports.getToken = function() {
    return "test_token";
}

function getDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentdate;
}