/**
 * Created by yuliang on 2016/12/6.
 */


const moment = require('moment')
const apiUtils = require('../../libs/api_utils')
const tokenService = require('../../middleware/service/oauth_service')
const userService = require('../../middleware/service/user_info_service')
const hamcSign = require('../../middleware/channel/hmac')
const apiCode = require('../../libs/api_code_enum')

module.exports = {
    noAuths: [],
    token: function *() {

        var clientId = this.checkQuery("client_id").notEmpty().toInt().value;
        var userId = this.checkQuery("username").notEmpty().value;
        var passWord = this.checkQuery("password").notEmpty().value;
        //var publicKey = this.checkQuery("publicKey").notEmpty().value;
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
        // if (clientInfo.publicKey !== publicKey) {
        //     this.error('publickKey不匹配')
        // }

        //此处验证userId和passWord
        var userToken = yield tokenService.getTokenByUserId(clientInfo.groupId, userId)
        if (userToken) {
            userToken.clientId = clientId
            return yield tokenService.refreshToken(userToken).then(convertToOldToken)
                .then(token=>this.body = token)
        }

        yield tokenService.createToken(clientInfo, userId).then(convertToOldToken)
            .then(token=>this.body = token)
    },
    refreshToken: function *() {
        var clientId = this.checkQuery("clientId").notEmpty().value;
        var refreshToken = this.checkQuery("refreshToken").notEmpty().value;
        var publicKey = this.checkQuery("publicKey").notEmpty().value;
        var sign = this.checkQuery("sign").notEmpty().value;
        this.errors && this.validateError()

        yield hamcSign.main.call(this)

        if (this.authorize.clientInfo.publicKey !== publicKey) {
            this.error('publickKey不匹配', apiCode.errCodeEnum.refreshTokenError, apiCode.retCodeEnum.oauthError)
        }

        var refreshTokenInfo = yield tokenService.getRefreshToken(refreshToken)
        if (!refreshTokenInfo || refreshTokenInfo.clientId != clientId) {
            this.error('未找到refreshToken,或者clientId不匹配', apiCode.errCodeEnum.refreshTokenError, apiCode.retCodeEnum.oauthError)
        }

        if (refreshTokenInfo.refreshTokenExpireDate < moment().format("X")) {
            return this.success("refreshToken已过期", apiCode.errCodeEnum.refreshTokenError, apiCode.retCodeEnum.oauthError)
        }

        yield tokenService.refreshToken(refreshTokenInfo).then(convertToOldToken)
            .then(token=>this.body = token)
    },
    clientInfo: function *() {
        var clientId = this.checkQuery("clientId").notEmpty().value;
        var sign = this.checkQuery("sign").notEmpty().value;
        this.errors && this.validateError()

        if (sign != "e74a35f5d1b61d1ff68852b004bd09c4") {
            this.error("sign错误")
        }

        yield tokenService.getClient(clientId).then(this.success)
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