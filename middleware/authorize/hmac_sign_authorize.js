/**
 * Created by yuliang on 2016/12/7.
 */

"use strict"

const co = require('co')
const apiUtils = require('../../libs/api_utils')
const apiCode = require('../../libs/api_code_enum')

module.exports = co.wrap(function *(content, key, sign) {
    this.authorize.flow.push('hmacSign')

    if (apiUtils.crypto.hmacSha1(content, key) !== sign) {
        console.log("正确签名应该是:" + apiUtils.crypto.hmacSha1(content, key));
        this.error('sign签名不匹配', apiCode.errCodeEnum.hmacsha1SignError, apiCode.retCodeEnum.oauthError)
    }

    return true
})