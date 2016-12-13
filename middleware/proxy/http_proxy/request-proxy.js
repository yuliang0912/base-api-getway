/**
 * Created by yuliang on 2016/12/5.
 */

const co = require('co')
const Promise = require('bluebird')
const request = require('request-promise')
const apiCode = require('../../../libs/api_code_enum')

module.exports = co.wrap(function *() {

    if (!this.authorize.proxyUrl) {
        this.error("未找到代理地址", apiCode.errCodeEnum.notFoundAgentServerError, apiCode.retCodeEnum.agentError)
    }

    var options = {
        method: this.req.method,
        uri: this.authorize.proxyUrl,
        headers: {},
        body: this.request.body,
        form: this.request.body,
        resolveWithFullResponse: true,
        json: true
    }

    if (this.authorize.tokenInfo) {
        options.headers.Authorization = "Basic " + new Buffer(this.authorize.tokenInfo.userId + ":1").toString("base64")
    } else if (this.authorize.userId) {
        options.headers.Authorization = "Basic " + new Buffer(this.authorize.userId + ":1").toString("base64")
    }

    yield request(options).then(response=> {
        if (response.statusCode === 404) {

        }
        this.body = response.body
    }).timeout(10000).catch(Promise.TimeoutError, ()=> {
        this.error("代理请求已超时", apiCode.errCodeEnum.requestTimeoutError, apiCode.retCodeEnum.agentError)
    })
})