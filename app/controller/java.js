/**
 * 智能硬件接口
 * @authors Your Name (you@example.org)
 * @date    2017-05-10 12:51:54
 * @version $Id$
 */

var _java_msg = '';

exports.post = function(req, res) {
	var data = req.bodyData;
	console.log(data)
	_java_msg = data;
	res.end(JSON.stringify(data))
}

exports.get = function(req, res) {
	console.log(_java_msg)
	res.end(JSON.stringify(_java_msg))
}


// var app = require('http').createServer(handler),
// 	io = require('socket.io').listen(app),
// 	fs = require('fs');
// app.listen(8080);

// function handler(req, res) {
// 	fs.readFile(__dirname + '/index.html', function(err, data) {
// 		if (err) {
// 			res.writeHead(500);
// 			return res.end('Error loading index.html');
// 		}
// 		res.writeHead(200);
// 		res.end(data);
// 	});
// }
// io.sockets.on('connection', function(socket) {
// 	io.sockets.emit('news', 'welcome to nodejs');
// 	var tweets = setInterval(function() {
// 		socket.emit('news', 'bieber tweet ok');
// 	}, 2000);
// 	socket.on('disconnect', function() {
// 		clearInterval(tweets);
// 		io.sockets.emit('user disconnected');
// 	});
// });