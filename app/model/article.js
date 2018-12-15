/**
 * model-article
 * @authors Flyteng (you@example.org)
 * @date    2017-01-20 13:26:12
 * @version $Id$
 */

var mysql = require("mysql");
var pool = require("../lib/sqlConfig.js").pool;
var fs = require('fs');
var async = require('async');
var myfs = require("../lib/myfs.js");
var DB = require("../lib/sqlConfig.js").DB;

var addSQL = "insert into article (path, status, title, date) values (?,?,?,?)";
var getSQL = 'select path,title,date from article where id=?';
var getAllSQL = 'select id,title,path,status from article';
var getPageSQL = "select * from `article` ORDER BY date DESC limit ?,?";
var delSQL = 'delete from article where id=?';
var updateSQL = 'select path from article where id=?';
var updateHitsSQL = "update article set hits = hits+1 where id = ?";
var statusGetSQL = "select status from article where id=?";
var statusUpdateSQL = 'update article set status=? where id=?';
var _ARTICLE_PATH_ = "./dis/article/";

/**
 * add article
 * @param {[type]} status  [0/1 sava/publish]
 * @param {[type]} content []
 */
exports.add = function(fileName, status, content, callback) {
    var title = fileName;
    fileName = '/' + fileName + '.md';
    var inserts = [],
        date = getDate();
    // console.log(date)
    // console.log(getPath())
    Array.prototype.push.call(inserts, getPath() + fileName, status, title, date);
    var sql = mysql.format(addSQL, inserts);

    pool.getConnection(function(err, connection) {
        if (err) throw err;
        var query = connection.query(sql);
        query
            .on('error', function(err) {
                if (err) throw err;
            })
            .on('result', function(rows) {
                console.log('Reslut is\n', rows);
                connection.pause();
                //同步创建文件目录
                var path = _ARTICLE_PATH_ + getPath();
                myfs.mkdirSync(path, '', function(e) {
                    if (e) {
                        console.log("mkdir falut");
                    } else {
                        console.log("mkdir success");
                    }
                });
                // 写入内容
                fs.writeFile(path + fileName, content, function(e) {
                    if (e) throw e;
                    console.log("write file");
                    connection.resume();
                });
            })
            .on('end', function() {
                console.log('connect end success\n');
                callback(true);
                connection.release();
            });
    });
}

// 查询路径->删除文件->删除记录
exports.del = function(id, callback) {
    var inserts = [];
    inserts.push(id);
    var deleteSql = mysql.format(delSQL, inserts);
    var selectSql = mysql.format(getSQL, inserts);
    var tasks = [function(cb) {
        console.log("Task1")
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(selectSql, function(err, rows) {
                if (err) throw err;
                connection.release();
                console.log(rows)
                if (rows.length == 0) {
                    console.log("can not find ")
                    cb(err, "undefined")
                } else cb(err, rows[0].path)
            });
        })
    }, function(path, cb) {
        console.log("Task2")
        if (path) {
            path = _ARTICLE_PATH_ + path;
            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
                console.log("del folder success")
            }
        }
        cb()
    }, function(cb) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(deleteSql, function(err, rows) {
                if (err) throw err;
                connection.release();
                console.log("del path")
                cb(err)
            });
        })
    }]

    async.waterfall(tasks, function(err, results) {
        if (err) {
            console.log(err);
        }
        callback()
    });
}

exports.get = function(id, callback) {
    var title,
        inserts = [],
        content,
        date;
    inserts.push(id);
    // 流程：统计hits->获取路径->读取文件
    var tasks = [function(cb) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            var sql = mysql.format(updateHitsSQL, inserts);
            console.log(sql);

            connection.query(sql, function(err, rows) {
                if (err) throw err;
                connection.release();
                cb(err)
            });
        })
    }, function(cb) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            var sql = mysql.format(getSQL, inserts);
            console.log(sql);

            connection.query(sql, function(err, rows) {
                if (err) throw err;
                connection.release();
                // console.log(rows[0])
                var path = _ARTICLE_PATH_ + rows[0].path;
                title = rows[0].title;
                date = rows[0].date;
                cb(err, path)
            });
        })
    }, function(path, cb) {
        fs.readFile(path, 'utf-8', function(err, data) {
            if (err) {
                throw err;
            } else {
                content = data;
                cb()
            }
        });
    }];

    async.waterfall(tasks, function(err) {
        if (err) {
            console.log(err);
        }
        callback({
            id: id,
            title: title,
            content: content,
            date: date
        });
    });

    // start query
    // pool.getConnection(function(err, connection) {
    //     if (err) throw err;
    //     var query = connection.query(sql);
    //     query
    //         .on('error', function(err) {
    //             if (err) throw err;
    //         })
    //         .on('result', function(rows) {
    //             // ready fs io
    //             connection.pause();
    //             console.log('Reslut is\n' + rows);
    //             var path = _ARTICLE_PATH_ + rows.path;
    //             title = rows.title;
    //             date = rows.date;
    //             // 结果集得出文件路径
    //             fs.readFile(path, 'utf-8', function(err, data) {
    //                 if (err) {
    //                     throw err;
    //                 } else {
    //                     content = data;
    //                 }
    //                 connection.resume();
    //             });
    //         })
    //         .on('end', function() {
    //             console.log('connect end success\n');
    //             callback({
    //                 id: id,
    //                 title: title,
    //                 content: content,
    //                 date: date
    //             });
    //             connection.release();
    //         });
    // });
}
exports.getAll = function(callback) {
    DB.query(getAllSQL, null, function(err, rows) {
        if (err) throw err;
        console.log("GET ARTICLE ALL");
        callback(rows);
    });
    // var result = [];
    // pool.getConnection(function(err, connection) {
    //     if (err) throw err;
    //     var query = connection.query(getAllSQL);
    //     query
    //         .on('error', function(err) {
    //             if (err) throw err;
    //         })
    //         .on('result', function(rows) {
    //             result.push(rows);
    //         })
    //         .on('end', function() {
    //             console.log('connect end success\n');
    //             connection.release();
    //             callback(result);
    //         });
    // });
}
exports.getPage = function(pageId, callback) {
    pageId = pageId | 0;
    var interval = 10,
        inserts = [],
        result = [];
    Array.prototype.push.call(inserts, pageId, interval);
    var sqlQuery = mysql.format(getPageSQL, inserts);
    console.log(sqlQuery)
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        var query = connection.query(sqlQuery);
        query
            .on('error', function(err) {
                if (err) throw err;
            })
            .on('result', function(rows) {
                result.push(rows);
            })
            .on('end', function() {
                console.log('connect end success\n');
                connection.release();
                callback(result);
            });
    });

}
exports.update = function(id, content, callback) {
    var result;
    var inserts = [];
    inserts.push(id);
    var sql = mysql.format(updateSQL, inserts);
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        var query = connection.query(sql);
        query
            .on('error', function(err) {
                if (err) throw err;
                callback(false);
            })
            .on('result', function(rows) {
                connection.pause();
                console.log('Reslut is\n' + rows);
                var path = _ARTICLE_PATH_ + rows.path;
                title = rows.title;
                // 结果集得出文件路径,更新文件内容
                fs.writeFile(path, content, function(e) {
                    if (e) throw e;
                    console.log("write file");
                    connection.resume();
                });
            })
            .on('end', function() {
                console.log('connect end success\n');
                callback(true);
                connection.release();
            });
    });
}
exports.status_get = function(id, callback) {
    var status;
    var inserts = [];
    inserts.push(id);
    var sql = mysql.format(statusGetSQL, inserts);
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        var query = connection.query(sql);
        query
            .on('error', function(err) {
                if (err) throw err;
                callback(false);
            })
            .on('result', function(rows) {
                if (err) throw err;
                status = rows.status;
                console.log('Reslut is\n', rows);
            })
            .on('end', function() {
                console.log('connect end success\n');
                callback({
                    id: id,
                    status: status
                });
                connection.release();
            })
    });

}
exports.status_update = function(id, status, callback) {
    var result;
    var inserts = [];
    Array.prototype.push.call(inserts, status, id);
    var sql = mysql.format(statusUpdateSQL, inserts);
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(sql, function(err, rows, fields) {
            if (err) {
                throw err;
                callback(false);
            }
            console.log('Reslut is\n', rows);
        });
        connection.end(function(err) {
            if (err) {
                return;
            }
            console.log('connect end success\n');
            callback(true);
            connection.release();
        });
    });
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

function getPath() {
    var date = new Date();
    var arr = [];
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var years = date.getFullYear();
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    Array.prototype.push.call(arr, years, month, strDate);
    return arr.join("/");
}