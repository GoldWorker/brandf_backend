/**
 * email
 * @authors Your Name (you@example.org)
 * @date    2016-12-21 15:32:50
 * @version $Id$
 */
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 25, // SMTP 端口
    // secureConnection: false, // 使用 SSL
    auth: {
        user: '13160677675@163.com',
        pass: '163mailroot'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

exports.send = function(data, callback) {
    // setup e-mail data with unicode symbols
    console.log(data);
    var mailOptions = {
        from: '13160677675@163.com', // 发件地址
        to: data.mailAddress, // 收件列表
        subject: data.title, // 标题
        //text和html两者只支持一种
        // text: 'Hello world ?', // 标题
        html: data.content // html 内容
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            // throw error
            console.log(error)
            callback && callback(false)
        } else {
            console.log('Message sent: ' + info.response);
            console.log(info)
            callback && callback(true)
        }
    });
}