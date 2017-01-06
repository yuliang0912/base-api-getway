/**
 * Created by yuliang on 2016/12/5.
 */

const co = require('co')
const Promise = require('bluebird')
const request = require('request-promise')
const apiCode = require('../../libs/api_code_enum')

module.exports = co.wrap(function *() {
    var options = {
        method: this.req.method,
        uri: this.authorize.proxyUrl,
        headers: this.headers || {},
        resolveWithFullResponse: true,
        json: false,
        encoding: null
    }

    options.headers.host = this.authorize.proxyRoute.redirectHost

    if (!options.headers['content-type']) {
        options.headers['content-type'] = "text/plain;charset=UTF-8"
    }
    if (!options.headers['accept']) {
        options.headers['accept'] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
    if (!options.headers['accept-language']) {
        options.headers['accept-language'] = "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3"
    }

    if (["GET", "HEAD", "DELETE"].indexOf(this.method.toUpperCase()) === -1) {
        if (this.is('urlencoded')) {
            options.form = this.request.body
        }
        else if (this.is('json')) {
            options.body = this.request.body
            options.json = true
        }
        else {
            options.body = this.request.body
        }
    }

    //body经过处理之后长度可能发生变化,删除此属性防止服务器一直等待接收数据
    delete options.headers['content-length']

    if (this.authorize.tokenInfo) {
        options.headers.Authorization = "Basic " + new Buffer(this.authorize.tokenInfo.userId + ":1").toString("base64")
    } else if (this.authorize.userId) {
        options.headers.Authorization = "Basic " + new Buffer(this.authorize.userId + ":1").toString("base64")
    }

    yield request(options).then(response=> {
        Object.keys(response.headers).forEach(header=> {
            this.set(header, response.headers[header])
        })
        this.body = response.body
    }).timeout(30000).catch(Promise.TimeoutError, ()=> {
        this.trackLog("代理请求已超时")
        this.error("代理请求已超时", apiCode.errCodeEnum.requestTimeoutError, apiCode.retCodeEnum.agentError)
    }).catch(error=> {
        let msg = "源服务器错误"
        let errorInfo = error['error']
        if (error['statusCode']) {
            msg += ",[状态码]:" + error.statusCode
        }
        if (!errorInfo) {
            msg += ",[错误详情01]:" + error.toString()
            this.error(msg, apiCode.errCodeEnum.originalServerError, apiCode.retCodeEnum.agentError)
            return
        }
        if (errorInfo instanceof Buffer) {
            msg += ",[错误详情02]:" + errorInfo.toString()
        }
        else if (errorInfo instanceof Object && !(errorInfo instanceof Error)) {
            msg += ",[错误详情03]:" + JSON.stringify(errorInfo)
        } else {
            msg += ",[错误详情04]:" + errorInfo.toString()
        }
        this.trackLog("http代理出现错误:" + msg)
        this.error(msg, apiCode.errCodeEnum.originalServerError, apiCode.retCodeEnum.agentError)
    })
    this.trackLog("http代理结束")
})