var sessions = require("../lib/session.js");
var cookie = require("../lib/cookie.js");
var email = require("../lib/email.js");
var comment = require("../model/comment.js");

exports.post_normal = function(req, res) {
	var cToken = cookie.get(req, 'token');
	var user = sessions.get(cToken).data.user;
	var data = req.bodyData;
	// console.log(data)
	comment.add({
		user_id: user.id,
		article_id: data.article_id,
		comment: data.comment
	}, function(result) {
		if (result) {
			result.name = user.name;
			res.end(JSON.stringify(result))
		}
		res.end(JSON.stringify({
			err: "add comment failt"
		}))
	})
}

exports.post_reply = function(req, res) {
	var cToken = cookie.get(req, 'token');
	var user = sessions.get(cToken).data.user;
	var data = req.bodyData;
	comment.add_reply({
		user_id: user.id,
		comment_id: data.comment_id,
		reply: data.reply
	}, function(result) {
		if (result) {
			result.name = user.name;
			res.end(JSON.stringify(result))
		}
		res.end(JSON.stringify({
			err: "add reply failt"
		}))
	})
}

exports.get_normal = function(req, res, article_id) {
	// console.log("ENTER C")
	comment.get(article_id, function(result) {
		if (result) {
			res.end(JSON.stringify(result))
		}
		res.end(JSON.stringify({
			err: "get reply failt"
		}))
	})
}