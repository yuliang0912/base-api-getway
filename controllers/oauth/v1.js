/**
 * Created by yuliang on 2016/12/6.
 * 兼容习网以前的版本,2017年2月之后新的APP将启用V2.js版本的登录机制
 */
"use strict"

const apiUtils = require('../../libs/api_utils')
const tokenService = require('../../middleware/service/oauth_service')
const userService = require('../../middleware/service/user_info_service')

module.exports = {
    noAuths: [],
    token: function *() {
        var clientId = this.checkQuery("client_id").notEmpty().toInt().value;
        var userId = this.checkQuery("username").notEmpty().value;
        var passWord = this.checkQuery("password").notEmpty().value;
        this.errors && this.validateError()
        var userInfo = yield userService.getUserInfo({userId})
        if (!userInfo) {
            this.error('用户名和密码不匹配', 10004, 0)
        }
        if (userInfo.PassWord !== apiUtils.crypto.sha512(passWord + userInfo.SaltValue).toUpperCase()) {
            this.error('用户名和密码不匹配', 10004, 0)
        }

        var clientInfo = yield tokenService.getClient(clientId)
        if (!clientInfo || clientInfo.status !== 0) {
            this.error('clientId错误或client status异常')
        }

        var userToken = yield tokenService.getTokenByUserId(clientInfo.groupId, userId)
        if (userToken) {
            userToken.clientId = clientId
            return yield tokenService.refreshToken(userToken).then(convertToOldToken)
                .then(token=>this.body = token)
        }

        yield tokenService.createToken(clientInfo, userId).then(convertToOldToken)
            .then(token=>this.body = token)
    }
}

function convertToOldToken(token) {
    return {
        access_token: token.accessToken,
        expires_in: parseInt(token.expireDate),
        openid: token.userId.toString(),
        refresh_token: token.refreshToken,
        //refresh_token_expires_in: token.refreshTokenExpireDate,
        token_type: "bearer"
    }
}