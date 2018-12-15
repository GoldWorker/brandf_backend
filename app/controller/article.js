/**
 * c-article
 * @authors Your Name (you@example.org)
 * @date    2016-12-14 23:21:40
 * @version $Id$
 */
var sessions = require("../lib/session.js");
var cookie = require("../lib/cookie.js");
var email = require("../lib/email.js");
var article = require("../model/article.js");
// var mysql = require("mysql");

exports.get_once = function(req, res, id) {
    if (id) {
        article.get(id, function(result) {
            console.log(result);
            res.end(JSON.stringify(result));
        });
    } else res.end(JSON.stringify({
        "error": "No args"
    }));
}

exports.get_all = function(req, res, args) {
    article.getAll(function(result) {
        console.log(result);
        res.end(JSON.stringify(result));
    })
}

exports.get_page = function(req, res, pageId) {

    article.getPage(pageId, function(result) {
        console.log(result);
        res.end(JSON.stringify(result));
    })
}

exports.post = function(req, res, args) {
    var art = req.bodyData;
    article.add(art.title, '0', art.content, function(result) {
        console.log(result);
        // console.log(req.bodyData);
        if (result) {
            res.end(JSON.stringify({
                result: "Add article success"
            }));
        } else res.end(JSON.stringify({
            result: "Add article falut"
        }));
    });
}

exports.put = function(req, res, args) {
    var art = req.bodyData;
    article.update(art.id, art.content, function(result) {
        console.log(result);
        if (result) {
            res.end(JSON.stringify({
                result: "article update success"
            }));
        } else res.end(JSON.stringify({
            result: "article update error"
        }));
    })
}

exports.delete_once = function(req, res, id) {
    article.del(id, function() {
        res.end(JSON.stringify({
            result: "delete success"
        }));
    })
}

exports.get_status = function(req, res, id) {
    if (id) {
        article.status_get(id, function(result) {
            console.log(result);
            res.end(JSON.stringify(result));
        })
    } else res.end(JSON.stringify({
        result: "",
        type: "args error"
    }));

}

exports.put_status = function(req, res, id, status) {
    if (id && status) {
        article.status_update(id, status, function(result) {
            console.log(result);
            if (result) {
                res.end(JSON.stringify({
                    result: "update success"
                }));
            } else res.end(JSON.stringify({
                result: "",
                type: "update error"
            }));
        })
    } else res.end(JSON.stringify({
        result: "",
        type: "args error"
    }));

}