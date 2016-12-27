/**
 * Created by yuliang on 2016/12/7.
 */

"use strict"

const co = require('co')
const moment = require('moment')
const apiCode = require('../../libs/api_code_enum')
const tokenService = require('../service/oauth_service')

module.exports = co.wrap(function*(accessToken) {
    this.authorize.flow.push('token')
    this.trackLog("开始进行accessToken认证")

    var token = yield tokenService.getToken(accessToken)

    if (!token) {
        this.trackLog("token认证失败")
        this.error('未找到有效token', apiCode.errCodeEnum.accessTokenError, apiCode.retCodeEnum.oauthError)
    }

    if (token.expireDate < moment().format("X")) {
        this.trackLog("token认证失败,已过期")
        this.error("token已过期", apiCode.errCodeEnum.accessTokenError, apiCode.retCodeEnum.oauthError)
    }

    this.authorize.tokenInfo = token
    this.trackLog("accessToken认证成功")
    return token;
})