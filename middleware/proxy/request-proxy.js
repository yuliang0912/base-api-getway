/**
 * Created by yuliang on 2016/12/5.
 */

const co = require('co')
const Promise = require('bluebird')
const request = require('request-promise')
const apiCode = require('../../libs/api_code_enum')
const _ = require('lodash')

module.exports = co.wrap(function *() {

    if (this.headers['content-type'] === undefined) {
        this.headers['content-type'] = "text/plain;charset=UTF-8";
    }

    var options = {
        method: this.req.method,
        uri: this.authorize.proxyUrl,
        headers: this.headers || {},
        resolveWithFullResponse: true,
        json: false,
        encoding: null
    }

    if (options.method === "POST") {
        if (this.headers['content-type'] === 'application/x-www-form-urlencoded') {
            options.form = this.request.body
        }
        else if (_.isString(this.request.body) || (_.isObject(this.request.body) && Object.keys(this.request.body).length > 0)) {
            options.body = this.request.body
        }
    }

    if (this.headers['content-type'] === 'application/json') {
        options.json = true
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
    }).timeout(30).catch(Promise.TimeoutError, ()=> {
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
        this.error(msg, apiCode.errCodeEnum.originalServerError, apiCode.retCodeEnum.agentError)
    })
    this.trackLog("http代理结束")
})