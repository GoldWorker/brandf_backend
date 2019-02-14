/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-07-26 22:33:57
 * @version $Id$
 */
var http = require('http');
var routes = require('./lib/routes.js');
var verify = require('./lib/verify.js');

var app = http.createServer(function(req, res) {
    // 对报文主体进行解析
    req.bodyData = "";
    req.on("data", function(data) {
        req.bodyData += data;
    });
    req.on("end", function() {
        // 调试阶段-设置允许跨域请求
        if (req.headers.origin == 'http://localhost:8080' || req.headers.origin == 'http://www.brandf.cn') {
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        }
        // res.setHeader('Access-Control-Allow-Origin', 'http://www.brandf.cn');
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        // 检测请求是否通过白名单或已登陆
        verify.check(req, function(result) {
            if (result) {
                // 请求主体仅接受json格式
                if (req.bodyData) {
                    req.bodyData = JSON.parse(req.bodyData);
                }
                // 进入路由解析
                routes.disaptcher(req, res);
            } else res.end(JSON.stringify({
                error: "No access"
            }))
        });
    });
}).listen(8010);


var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
    io.sockets.emit('news', 'welcome to nodejs');
    var tweets = setInterval(function() {
        socket.emit('news', 'bieber tweet ok');
    }, 2000);
    socket.on('hello', function(data) {
        console.log(data)
    })
    socket.on('disconnect', function() {
        clearInterval(tweets);
        io.sockets.emit('user disconnected');
    });
});

// 终端打印如下信息
// console.log('Server running');