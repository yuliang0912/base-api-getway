/**
 * Created by yuliang on 2016/12/9.
 */

"use strict"

const co = require('co')
const apiUtils = require('../../libs/api_utils')
const apiCode = require('../../libs/api_code_enum')

module.exports = co.wrap(function *(content, sign) {
    this.trackLog("开始进行md5Sign认证")
    this.authorize.flow.push('md5Sign')

    if (apiUtils.crypto.md5(content) !== sign) {
        this.trackLog("md5Sign签名认证失败")
        this.error('sign签名不匹配', apiCode.errCodeEnum.hmacsha1SignError, apiCode.retCodeEnum.oauthError)
    }
    this.trackLog("md5Sign认证成功")
    return true
})