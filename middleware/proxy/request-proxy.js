/**
 * Created by yuliang on 2016/12/5.
 */

const co = require('co')
const Promise = require('bluebird')
const request = require('request-promise')
const apiCode = require('../../libs/api_code_enum')

module.exports = co.wrap(function *() {
    this.trackLog("进入http代理")
    if (!this.authorize.proxyUrl) {
        this.error("未找到代理地址", apiCode.errCodeEnum.notFoundAgentServerError, apiCode.retCodeEnum.agentError)
    }

    var options = {
        method: this.req.method,
        uri: this.authorize.proxyUrl,
        headers: this.headers,
        body: this.request.body,
        form: this.request.body,
        resolveWithFullResponse: true,
        json: true,
        encoding: null
    }

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
        var msg = "源服务器错误"
        if (error['statusCode']) {
            msg += ",[状态码]:" + error.statusCode
        }
        if (error['error']) {
            msg += ",[错误详情]:" + error['error'].toString()
        }
        this.error(msg, apiCode.errCodeEnum.originalServerError, apiCode.retCodeEnum.agentError)
    })
    this.trackLog("http代理结束")
})