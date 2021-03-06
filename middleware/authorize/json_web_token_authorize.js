/**
 * Created by yuliang on 2017/8/7.
 */


"use strict"

const co = require('co')
const fs = require('fs')
const apiCode = require('../../libs/api_code_enum')
const apiUtils = require('../../libs/api_utils')
const publicKey = fs.readFileSync('configs/public_key.pem').toString()

module.exports = co.wrap(function* (ctx) {

    this.trackLog("开始进行jwt认证")

    this.authorize.flow.push('jwt')

    let jwtStr = this.cookies.get('authInfo')
    if (!jwtStr) {
        let auth = this.headers.authorization || ''
        auth.startsWith('Bearer ') && (jwtStr = auth.replace('Bearer ', ''))
    }

    if (!jwtStr) {
        this.error("未找到jwtStr信息", apiCode.errCodeEnum.jwtTokenAuthError, apiCode.retCodeEnum.authenticationFailure)
    }

    let jwtPartArray = jwtStr.split('.')
    if (jwtPartArray.length !== 3) {
        this.error("jwtStr格式错误", apiCode.errCodeEnum.jwtTokenAuthError, apiCode.retCodeEnum.authenticationFailure)
    }

    let isVerify = apiUtils.crypto.rsaSha256Verify(`${jwtPartArray[0]}.${jwtPartArray[1]}`, jwtPartArray[2], publicKey)
    if (!isVerify) {
        this.error("jwtStr验证失败", apiCode.errCodeEnum.jwtTokenAuthError, apiCode.retCodeEnum.authenticationFailure)
    }

    let jwtObj = JSON.parse(apiUtils.crypto.base64Decode(jwtPartArray[1]))
    if (jwtObj.exp < Math.round(new Date().getTime() / 1000)) {
        this.error("jwtStr已过期", apiCode.errCodeEnum.jwtTokenAuthError, apiCode.retCodeEnum.authenticationFailure)
    }

    this.authorize.jwtInfo = jwtObj

    return true
});