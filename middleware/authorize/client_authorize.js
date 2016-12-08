/**
 * Created by yuliang on 2016/12/7.
 */

"use strict"

const co = require('co')
const apiCode = require('../../libs/api_code_enum')
const tokenService = require('../service/oauth_service')

module.exports = co.wrap(function*(clientId) {
    this.authorize.flow.push('client')

    var clientInfo = yield tokenService.getClient(clientId)

    if (!clientInfo || clientInfo.status !== 0) {
        this.error('clientId错误或client status异常', apiCode.errCodeEnum.clientError, apiCode.retCodeEnum.oauthError)
    }

    this.authorize.clientInfo = clientInfo
})
