/**
 * Created by yuliang on 2017/2/17.
 */

"use strict"

const moment = require('moment')
const apiUtils = require('../../libs/api_utils')
const tokenService = require('../../middleware/service/oauth_service')
const userService = require('../../middleware/service/user_info_service')
const smsService = require('../../middleware/service/cw_gw_sms_service')
const hamcSign = require('../../middleware/channel/hmac')
const apiCode = require('../../libs/api_code_enum')
const log = require('../../libs/log4')
const logger4login = log.getLogs('login')

module.exports = {
    noAuths: [],
    token: function *() {
        var clientId = this.checkQuery("clientId").toInt().value;
        var brandId = this.checkQuery("brandId").toInt().value;
        var userName = this.checkQuery("userName").isNumeric().value;
        var passWord = this.checkQuery("passWord").notEmpty().value;
        var appVersionId = this.checkQuery("appVersionId").default('').value;
        var phoneVersion = this.checkQuery("phoneVersion").default('').value;
        var osVersion = this.checkQuery("osVersion").default('').value;
        this.errors && this.validateError()

        var userMobile = ""
        var condition = {business_id: brandId}
        if (/^1[34578]\d{9}$/.test(userName)) {  //是手机号码
            condition.mobile = userName
        } else {
            condition.user_id = userName
        }

        var smsUserInfo = yield smsService.getUser(condition)
        if (!smsUserInfo && condition.mobile) {
            this.error('当前手机号尚未绑定', apiCode.errCodeEnum.accessTokenMobileError, apiCode.retCodeEnum.oauthError)
        } else if (smsUserInfo) {
            userName = smsUserInfo.user_id
            userMobile = smsUserInfo.mobile
        }

        var userInfo = yield userService.getUserInfo({userId: userName})
        if (!userInfo) {
            this.error('用户名或者密码不匹配', apiCode.errCodeEnum.userIdOrPwdError, apiCode.retCodeEnum.oauthError)
        }

        //此处验证passWord
        if (userInfo.PassWord !== apiUtils.crypto.sha512(passWord + userInfo.SaltValue).toUpperCase()) {
            this.error('用户名或者密码不匹配', apiCode.errCodeEnum.userIdOrPwdError, apiCode.retCodeEnum.oauthError)
        }
        userInfo.mobile = userMobile

        //验证clientInfo
        var clientInfo = yield tokenService.getClient(clientId)
        if (!clientInfo || clientInfo.status !== 0) {
            this.error('clientId错误或client status异常', apiCode.errCodeEnum.clientError, apiCode.retCodeEnum.oauthError)
        }

        // 用户登录成功 记录 clientId, brandId, appVersionId, uid,手机号，姓名，手机类型，手机型号
        logger4login.info(`${clientId}|${brandId}|${appVersionId}|${userInfo.UserID}|${userInfo.mobile}|${userInfo.RealName}|${phoneVersion}|${osVersion}`)

        //获取token
        var userToken = yield tokenService.getTokenByUserId(clientInfo.groupId, userName)
        if (userToken) {
            userToken.clientId = clientId
            return yield tokenService.refreshToken(userToken).then(token=> {
                this.success(buildToken(token, userInfo))
            })
        }

        yield tokenService.createToken(clientInfo, userName).then(token=> {
            this.success(buildToken(token, userInfo))
        })
    },
    refreshToken: function *() {
        var clientId = this.checkQuery("clientId").notEmpty().value;
        var refreshToken = this.checkQuery("refreshToken").notEmpty().value;
        var publicKey = this.checkQuery("publicKey").notEmpty().value;
        var sign = this.checkQuery("sign").notEmpty().value;

        this.errors && this.validateError()

        yield hamcSign.main.call(this)

        if (this.authorize.clientInfo.publicKey !== publicKey) {
            this.error('publickKey不匹配', apiCode.errCodeEnum.refreshTokenError, apiCode.retCodeEnum.refreshTokenError)
        }

        var refreshTokenInfo = yield tokenService.getRefreshToken(refreshToken)
        if (!refreshTokenInfo) {
            this.error('未找到refreshToken', apiCode.errCodeEnum.refreshTokenError, apiCode.retCodeEnum.refreshTokenError)
        }
        if (refreshTokenInfo.clientId != clientId) {
            this.error('clientId不匹配', apiCode.errCodeEnum.clientError, apiCode.retCodeEnum.refreshTokenError)
        }
        if (refreshTokenInfo.refreshTokenExpireDate < moment().format("X")) {
            this.error("refreshToken已过期", apiCode.errCodeEnum.refreshTokenError, apiCode.retCodeEnum.refreshTokenError)
        }

        yield tokenService.refreshToken(refreshTokenInfo).then(buildrefreshToken).then(this.success).catch(err=> {
            this.error("刷新token出现异常:" + err.toString(), apiCode.errCodeEnum.refreshTokenError, apiCode.retCodeEnum.refreshTokenError)
        })
    },
    //(private)自己方便查看clienInfo使用,不对外提供
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

function buildToken(token, userInfo) {
    return {
        accessToken: token.accessToken,
        expiresIn: parseInt(token.expireDate),
        refreshToken: token.refreshToken,
        refreshTokenExpiresIn: parseInt(token.refreshTokenExpireDate),
        userId: userInfo.UserID,
        mobile: userInfo.mobile,
        realName: userInfo.RealName,
        nickName: userInfo.DisplayName,
        avatar: !userInfo.PhotoURL || userInfo.PhotoURL.indexOf("uidimg_default") > -1 ? "" : userInfo.PhotoURL,
    }
}

function buildrefreshToken(token) {
    return {
        accessToken: token.accessToken,
        expiresIn: parseInt(token.expireDate),
        refreshToken: token.refreshToken,
        refreshTokenExpiresIn: parseInt(token.refreshTokenExpireDate),
    }
}