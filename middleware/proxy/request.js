/**
 * Created by yuliang on 2017/2/4.
 */

const co = require('co')
const Request = require('request')
const koaLog = require('../../libs/log4').koa
const apiUtil = require('../../libs/api_utils')
const apiCode = require('../../libs/api_code_enum')

module.exports = co.wrap(function *() {
    var options = {
        method: this.req.method,
        uri: this.authorize.proxyUrl,
        headers: this.headers || {},
        json: false,
        gzip: false, //无需解压响应的内容
        timeout: 30000, //默认30秒
        encoding: null
    }


    //设置HOST,不然代理网页的时候无法正常加载
    options.headers.host = this.authorize.proxyRoute.redirectHost

    if (["GET", "HEAD", "DELETE"].indexOf(this.method.toUpperCase()) === -1) {
        if (this.is('urlencoded')) {
            options.form = this.request.body
        }
        else if (this.is('json')) {
            options.body = this.request.body
            options.json = true
        }
        else if (!apiUtil.isEmptyObject(this.request.body)) {
            options.body = this.request.body
        }
        else if (this.is('multipart') && this.req.readable) {
            options.timeout = 180000; //文件流超时设置为3分钟
        }
    }

    //body经过处理之后长度可能发生变化,删除此属性防止服务器一直等待接收数据
    delete options.headers['content-length']
    //干掉请求中的if-modified-since字段，以防命中服务端缓存，返回304
    //delete options.headers['if-modified-since']

    //删除代理服务器授权需要的header-key,防止伪造
    //delete options.headers['auth-token']


    let userToken = null
    if (this.authorize.tokenInfo) {
        userToken = {
            info: this.authorize.tokenInfo,
            type: "oauthToken"
        }
    } else if (this.authorize.userId) {
        userToken = {
            info: this.authorize.userId,
            type: "basice"
        }
    } else if (this.authorize.jwtInfo) {
        userToken = {
            info: this.authorize.jwtInfo,
            type: 'jwt'
        }
        if (this.cookies.get('authInfo')) {
            options.headers["authorization"] = `Bearer ${this.cookies.get('authInfo')}`
        }
    }

    if (userToken) {
        options.headers["auth-token"] = apiUtil.crypto.base64Encode(JSON.stringify(userToken))
    }

    yield new Promise((resolve, reject) => {
        let ProxyServer = Request(options, (err, response) => {
            err ? reject(err)
                : /^[2|3]/.test(response.statusCode)
                ? resolve(response)
                : reject(Object.assign(new Error(response.body), {
                    code: "httpStatusCodeError",
                    statusCode: response.statusCode || "NULL"
                }))
        })
        if (this.req.readable && ["GET", "HEAD", "DELETE"].indexOf(this.method.toUpperCase()) === -1) {
            this.req.pipe(ProxyServer)
        }
    }).then(response => {
        Object.keys(response.headers).forEach(header => {
            this.set(header, response.headers[header])
        })
        this.body = response.body
    }).catch(err => {
        var msg = "服务器错误"
        switch (err.code) {
            case "ETIMEDOU":
            case "ESOCKETTIMEDOUT":
                msg = "连接已经超时"
                break;
            case "ECONNREFUSED":
                msg = "不能连接到目标服务器"
                break;
            case "httpStatusCodeError":
                msg = "源服务器错误,[状态码]:" + err.statusCode
                break;
            case undefined:
                break;
            default:
                msg += ",code:" + err.code
                break;
        }
        msg += ",[错误详情]:" + err.toString()

        koaLog.getLogger().warn("======http代理出现错误:begin======")
        koaLog.getLogger().warn("请求option:" + JSON.stringify(options))
        koaLog.getLogger().warn("错误信息:" + msg)
        koaLog.getLogger().warn("======http代理出现错误:end======")

        this.error(msg, apiCode.errCodeEnum.originalServerError, apiCode.retCodeEnum.agentError)
    })
})