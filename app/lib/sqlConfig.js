/**
 * sql
 * @authors Your Name (you@example.org)
 * @date    2016-12-19 18:00:50
 * @version $Id$
 */
var mysql = require("mysql");
exports.pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'mypassword',
	port: '3306',
	database: 'nfs'
});


// var mysql   = require("mysql");

// var pool = mysql.createPool({
//     connectionLimit : 10,
//     host: Config.appSettings().database.host,
//     user: Config.appSettings().database.username,
//     password: Config.appSettings().database.password,
//     database: Config.appSettings().database.database
// });

var pool = mysql.createPool({
	connectionLimit: 20,
	host: 'localhost',
	user: 'root',
	password: 'mypassword',
	port: '3306',
	database: 'nfs'
});

exports.DB = (function() {

	function _query(query, params, callback) {
		// console.log("Enter Query")
		pool.getConnection(function(err, connection) {
			// console.log("Enter Query Callback")
			if (err) {
				console.log(err);
				connection.release();
				callback(null, err);
				throw err;
			}

			connection.query({
				sql: query,
				timeout: 40000
			}, params, function(err, rows) {
				connection.release();
				if (!err) {
					callback(err, rows);
				} else {
					throw err
					callback(err)
				}
			});

			connection.on('error', function(err) {
				connection.release();
				throw err;
				callback(null, err);
			});
		});
	};

	return {
		query: _query
	};
})();

// module.exports = DB;

// var DB = require('../dal/base.js');

// DB.query("select * from tasks", null, function (data, error) {
//    callback(data, error);
// });