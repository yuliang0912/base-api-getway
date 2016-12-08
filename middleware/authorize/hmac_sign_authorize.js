/**
 * Created by yuliang on 2016/12/7.
 */

"use strict"

const co = require('co')
const apiUtils = require('../../libs/api_utils')
const apiCode = require('../../libs/api_code_enum')

module.exports = co.wrap(function *(content, key, sign) {
    this.authorize.flow.push('hmacSing')

    if (apiUtils.crypto.hmacSha1(content, key) !== sign) {
        this.error('sign签名不匹配', apiCode.errCodeEnum.hmacsha1SignError, apiCode.retCodeEnum.oauthError)
    }
})