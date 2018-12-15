var mysql = require("mysql");
// var pool = require("../lib/sqlConfig.js").pool;
var async = require('async');
var DB = require("../lib/sqlConfig.js").DB;

exports.add = function(data, callback) {
	var sql_query = "insert into article_comment (user_id, article_id, comment, date) values (?,?,?,?)"
	data.date = getDate();
	var tasks = [function(cb) {
		DB.query(sql_query, [data.user_id, data.article_id, data.comment, data.date], function(err, rows) {
			// console.log(rows)
			data.comment_id = rows.insertId;
			data.reply = [];
			cb()
		})
	}]
	async.waterfall(tasks, function(err, results) {
		if (err) {
			console.log(err);
			callback && callback(false);
		}
		// console.log(data)
		callback && callback(data);
	});
}

exports.add_reply = function(data, callback) {
	var sql_query = "insert into comment_reply (comment_id, reply, date, user_id) values (?,?,?,?)"
	data.date = getDate();
	var tasks = [function(cb) {
		DB.query(sql_query, [data.comment_id, data.reply, data.date, data.user_id], function(err, rows) {
			data.reply_id = rows.insertId;
			cb()
		})
	}]
	async.waterfall(tasks, function(err, results) {
		if (err) {
			console.log(err);
			callback && callback(false);
		}
		callback && callback(data);
	});
}

// var data = [{
// 	comment: "",
// 	user: {},
// 	date: ""
// 	reply: [{
// 		reply: "",
// 		user: {},
// 		date: ""
// 	}]
// }]
exports.get = function(article_id, callback) {
	var sql_query_commment = "SELECT article_comment.comment_id,article_comment.comment,article_comment.date,users.name,users.id FROM article_comment,users WHERE article_comment.user_id = users.id AND article_id = ? ORDER BY date DESC"
	var sql_query_reply = "SELECT comment_reply.reply_id,comment_reply.reply,comment_reply.date,comment_reply.comment_id,users.id,users.name FROM comment_reply,users WHERE comment_reply.user_id=users.id AND comment_id=? ORDER BY date DESC"
	var date = getDate();
	var _sqlList = [];
	var tasks = [function(cb) {
		console.log("TASK 1")
		DB.query(sql_query_commment, [article_id], function(err, rows) {
			for (var i = rows.length - 1; i >= 0; i--) {
				_sqlList.push(mysql.format(sql_query_reply, [rows[i].comment_id]))
			}
			// console.log(_sqlList)
			// 构造查询语句
			cb(err, rows, _sqlList)
		})
	}, function(_comment, _sqlList, cb) {
		console.log("TASK 2");
		var _reply = [];
		var count = _comment.length;
		// console.log(count)
		if (count) {
			for (var i = _comment.length - 1; i >= 0; i--) {
				DB.query(sql_query_reply, _comment[i].comment_id, function(err, rows) {
					_reply.push(rows)
					if (0 === --count) {
						cb(_comment, _reply);
					}
				})
				_comment[i].reply = [];
			}
		} else cb([], []);
	}]
	async.waterfall(tasks, function(_comment, _reply) {
		// console.log(_comment)
		// console.log("-------------------------------------------")
		// console.log(_reply)
		// 数据结构构建
		for (var i = _reply.length - 1; i >= 0; i--) {
			var item = _reply[i];
			if (item.length != 0) {
				// console.log(_reply[i])
				var id = item[0].comment_id;
				for (var k = _comment.length - 1; k >= 0; k--) {
					if (_comment[k].comment_id == id) {
						_comment[k].reply = _reply[i];
						break;
					}
				}
				// _comment[item[0].comment_id - 1].reply = _reply[i]
			}
		}
		// var k = 0;
		// for (var i = _comment.length - 1; i >= 0; i--) {
		// 	if (_reply[i]) {
		// 		_comment[k].reply = _reply[i]
		// 	}
		// 	k++;
		// }
		console.log("RES");
		// console.log(_comment);
		callback && callback(_comment);
	});
}

exports.del = function(comment_id, content, callback) {

}

exports.del_reply = function(comment_id, content, callback) {

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