/**
 * Created by yuliang on 2016/12/9.
 */

"use strict"

const co = require('co')
const apiUtils = require('../../libs/api_utils')
const apiCode = require('../../libs/api_code_enum')

module.exports = co.wrap(function *(content, sign) {
    this.authorize.flow.push('md5Sign')

    if (apiUtils.crypto.md5(content) !== sign) {
        this.error('sign签名不匹配', apiCode.errCodeEnum.hmacsha1SignError, apiCode.retCodeEnum.oauthError)
    }

    return true
})