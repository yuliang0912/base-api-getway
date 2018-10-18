"use strict"

const co = require('co')
const fs = require('fs')
const apiCode = require('../../libs/api_code_enum')
const apiUtils = require('../../libs/api_utils')
const publicKey = fs.readFileSync('configs/public_key.pem').toString()

module.exports = co.wrap(function* (ctx) {

    this.trackLog("开始进行jwt认证")

    this.authorize.flow.push('jwt')

    let jwtStr = this.cookies.get('nodeInfo')
    if (!jwtStr) {
        let auth = this.headers.nodeInfo || ''
        auth.startsWith('Bearer ') && (jwtStr = auth.replace('Bearer ', ''))
    }

    if (!jwtStr) {
        return
    }

    let jwtPartArray = jwtStr.split('.')
    if (jwtPartArray.length !== 3) {
        return
    }

    let isVerify = apiUtils.crypto.rsaSha256Verify(`${jwtPartArray[0]}.${jwtPartArray[1]}`, jwtPartArray[2], publicKey)
    if (!isVerify) {
        return
    }

    let jwtObj = JSON.parse(apiUtils.crypto.base64Decode(jwtPartArray[1]))
    if (jwtObj.exp < Math.round(new Date().getTime() / 1000)) {
        this.error("jwtStr已过期", apiCode.errCodeEnum.jwtTokenAuthError, apiCode.retCodeEnum.authenticationFailure)
    }

    this.authorize.jwtInfo = jwtObj

    return true
});