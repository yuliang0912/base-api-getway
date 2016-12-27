/**
 * Created by yuliang on 2016/12/7.
 */

"use strict"

const co = require('co')
const apiCode = require('../../libs/api_code_enum')
const userService = require('../service/user_info_service')
const apiUtils = require('../../libs/api_utils')


module.exports = co.wrap(function*(userId, password) {
    this.authorize.flow.push('passWord')
    this.trackLog("开始进行用户名和密码认证")

    var userInfo = yield userService.getUserInfo({userId})

    if (!userInfo) {
        this.trackLog("用户名和密码认证失败,未找到用户信息" + userId)
        this.error('用户名或者密码错误', apiCode.errCodeEnum.passWordError, apiCode.retCodeEnum.authenticationFailure)
    }
    if (userInfo.PassWord !== apiUtils.crypto.sha512(password + userInfo.SaltValue).toUpperCase()) {
        this.trackLog("用户名和密码认证失败,密码不匹配")
        this.error('用户名或者密码错误', apiCode.errCodeEnum.passWordError, apiCode.retCodeEnum.authenticationFailure)
    }

    this.authorize.userInfo = userInfo
    this.trackLog("用户名和密码认证通过")
    return userInfo;
})