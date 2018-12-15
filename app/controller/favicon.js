/**
 * c-favicon
 * @authors Your Name (you@example.org)
 * @date    2017-1-19 18:04:00
 * @version $Id$
 */
exports.get_favicon = function(req, res, args) {
    console.log("favicon");
    res.end("favicon");
}
