/**
 * dispatcher
 * @authors Your Name (you@example.org)
 * @date    2016-12-14 23:45:58
 * @version $Id$
 */
var url = require('url');
var debug = require('./lib.js');

exports.disaptcher = function(req, res) {
    var pathname = url.parse(req.url).pathname;
    var paths = pathname.split('/');
    var controller = paths[1] == 'favicon.ico' ? 'favicon' : (paths[1] || 'index');
    var action = paths[1] == 'favicon.ico' ? 'favicon' : (paths[2] || '');
    var args = paths.slice(3);

    var module;
    var methodString = req.method;

    debug.log(controller)
    debug.log(action)

    switch (methodString) {
        case 'GET':
            routes('get');
            break;
        case 'POST':
            routes('post');
            break;
        case 'PUT':
            routes('put');
            break;
        case 'DELETE':
            routes('delete');
            break;
        default:
            res.end('place check request method');
            break;
    }

    function routes(methodString) {
        try {
            module = require('../controller/' + controller);
        } catch (err) {
            debug.log(err);
            res.end('404 controller not find');
            return;
        }
        //RESTful 风格拼接
        if (action) {
            action = methodString + '_' + action;
        } else action = methodString;

        var method = module[action];
        try {
            // debug.log([req, res].concat(args))
            method.apply(null, [req, res].concat(args));
        } catch (err) {
            debug.log('method not find\n' + err);
            res.end('404 method not find\n' + method);
        }

    }


}
