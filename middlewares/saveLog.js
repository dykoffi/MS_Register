const model = require("../db")
const onFinished = require('on-finished');


module.exports = function () {
    return (req, res, next) => {
        res.header("x-powered-by", "cqx")
        onFinished(res, async () => {
            await model.log_.create(
                {
                    data:
                    {
                        protocol: req.protocol,
                        method: req.method,
                        hostname: req.hostname,
                        path: req.originalUrl || req.url,
                        httpVersion: req.httpVersionMajor + '.' + req.httpVersionMinor,
                        statusCode: res.statusCode,
                        userIp: req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress),
                        userReferer: req.headers['referer'],
                        userAgent: req.headers['user-agent']
                    }
                }
            )
        })
        next()
    };
}