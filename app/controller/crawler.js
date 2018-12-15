var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	iconv = require('iconv-lite'),
	cheerio = require('cheerio'),
	querystring = require('querystring');

exports.get_weibo = function (req, res) {
	// var contents = querystring.stringify({
	// 	uid: "XXXX",
	// 	pwd: "XXXX"
	// });
	// var options = {
	// 	host: "http://www.zhbit.com",
	// 	path: "/index.html",
	// 	method: "get",
	// 	headers: {
	// 		// "Content-Type": "application/x-www-form-urlencoded; charset=utf8", // 可以设置一下编码
	// 		// "Content-Length": contents.length, // 请求长度, 通过上面计算得到
	// 		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
	// 		// 这些都是用抓包程序看到的..就都写上了, 若想少写, 可以一个一个删除试试
	// 		"Accept-Encoding": "gzip,deflate,sdch",
	// 		"Accept-Language": "zh-CN, zh;q=0.8",
	// 		"Cache-Control": "max-age=0",
	// 		"Connection": "Keep-Alive",
	// 		// "Host": "www.baidu.com",
	// 		// "Origin": "http://www.baidu.com",
	// 		// "Referer": "http://www.baidu.com/login",
	// 		"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.92 Safari/537.1 LBBROWSER"
	// 	}
	// };
	var options = {
		host: "ac.qq.com",
		path: "/",
		port: 80,
		method: "GET",
		headers: {
			// "Content-Type": "application/x-www-form-urlencoded; charset=utf8", // 可以设置一下编码
			// "Content-Length": contents.length, // 请求长度, 通过上面计算得到
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			// 这些都是用抓包程序看到的..就都写上了, 若想少写, 可以一个一个删除试试
			// "Accept-Encoding": "gzip,deflate,sdch",
			"Accept-Language": "zh-CN, zh;q=0.8",
			"Cache-Control": "max-age=0",
			"Connection": "Keep-Alive",
			// "Host": "www.baidu.com",
			// "Origin": "http://www.baidu.com",
			// "Referer": "http://www.baidu.com/login",
			// "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
			'User-Agent': 'spider' //微博对搜索的引擎优化
		}
	}
	var html = '';
	var _selfRes = res;

	var http_res = http.request(options, function (res) {
		res.setEncoding('binary');
		res.on('data', function (data) {
			html += data;
		})
		res.on('end', function () {
			// 解码
			html = iconv.decode(html, 'utf-8');
			// console.log(html);
			// html = iconv.decode(html, 'gb2312');
			// 正则替换 两空格|\t|\n|\r
			html = html.replace(/\s{2}|\\t|\\n|\\r|\\/g, "");

			// var reg = /\<ul class=\"ul_text\" id=[\s\S]*\<\/ul\>/g;
			// var reg = /\<div class=\"UG_list_c\" action-type=\"feed_list_item\" href=\"[\s\S]*\" suda-uatrack=\"[\s\S]*\"\>\<div class=\"pic W_piccut_v\"\>\<a href=\"[\s\S]*\" target=\"_blank\"\>\<img src=\"[\s\S]*\" alt=\"\"\>\<\/a\>\<\/div\>\<div class=\"list_des\"\>\<h3 class=\"list_title_s\"\>\<a href=\"[\s\S]*\" class=\"S_txt1\" target=\"_blank\"\>[\s\S]*\<\/a\>\<\/h3\>\<div class=\"des_main S_txt2\"\>[\s\S]*\<\/div\>\<\/div\>\<\/div\>/g;
			// var reg = /\<ul class=\"in-sherank-list\"\>[\s\S]*\<\/ul>/g;
			var reg = /<em class="ui-border-em ui-sherank-top">[\s\S]\<\/em><a href="[\s\S]*" class="in-anishe-name" title="腾讯动漫-[\s\S]*<\/a><i class="ui-rank-trend-down"><\/i><i class=""><\/i>/g
			// 全局搜索
			var result = html.match(reg);

			result = "<div><li><div>" + result[0] + "</div></li></div>";
			// _selfRes.end(result)
			$ = cheerio.load(result);
			// html = (new iconv('GBK', 'UTF-8')).convert(new Buffer(html, 'binary')).toString();

			html = $('div>a').map(function (index, elem) {
				// var el_href = $(this).find("a").attr('href');
				// var href_reg = /http\:\/\/weibo/g;
				// if (!href_reg.test(el_href)) {
				// 	el_href = "http://weibo.com" + el_href;
				// }
				return {
					title: $(this).text(),
					href: $(this).attr('href'),
					hits: ""
				}
				// console.log($(this).attr('href'));
			}).toArray();

			// console.log(res.headers)
			console.log(html);
			_selfRes.end(JSON.stringify(html))
		})
		res.on('error', function (err) {
			console.log(err);
		})

	})

	http_res.on('error', function (err) {
		console.log(err.message)
	})

	http_res.end();
}