/**
 * Created by yuliang on 2016/12/7.
 */

"use strict"

const co = require('co')
const apiCode = require('../../libs/api_code_enum')

module.exports = co.wrap(function*(userId, password) {
    this.authorize.flow.push('passWord')

    var userInfo = {}
    var isPass = false

    if (!isPass) {
        this.error('用户名或者密码错误', apiCode.errCodeEnum.passWordError, apiCode.retCodeEnum.authenticationFailure)
    }

    this.authorize.userInfo = userInfo
})