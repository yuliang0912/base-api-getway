/**
 * Created by yuliang on 2016/12/7.
 */

"use strict"

const co = require('co')
const apiCode = require('../../libs/api_code_enum')
const tokenService = require('../service/oauth_service')

module.exports = co.wrap(function*(clientId) {
    this.authorize.flow.push('client')
    this.trackLog("开始进行clientId认证")

    if (this.authorize.clientInfo) {
        return this.authorize.clientInfo
    }

    var clientInfo = yield tokenService.getClient(clientId)

    if (!clientInfo || clientInfo.status !== 0) {
        this.trackLog("clientId认证失败")
        this.error('clientId错误或client status异常', apiCode.errCodeEnum.clientError, apiCode.retCodeEnum.oauthError)
    }

    this.authorize.clientInfo = clientInfo
    this.trackLog("clientId认证成功")
    return clientInfo
})
