/**
 * Created by yuliang on 2016/12/5.
 */

const co = require('co')
const Promise = require('bluebird')
const request = require('request-promise')
const apiCode = require('../../../libs/api_code_enum')

module.exports = co.wrap(function *(url) {
    var options = {
        uri: url,
        //headers: this.req.headers,
        resolveWithFullResponse: true
    }

    yield request(options).then(response=> {
        this.body = response.body;
    }).timeout(1500).catch(Promise.TimeoutError, ()=> {
        this.error("代理请求已超时", apiCode.errCodeEnum.requestTimeoutError, apiCode.retCodeEnum.agentError)
    })
})