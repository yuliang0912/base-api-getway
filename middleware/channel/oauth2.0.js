/**
 * Created by yuliang on 2016/12/6.
 */

"use strict"

const co = require('co')
const moment = require('moment')
const apiCodeEnum = require('../../libs/api_code_enum')
const clientAuthorize = require('../authorize/client_authorize')
const tokenAuthorize = require('../authorize/token_authorize')
const clientCredentialsAuthorize = require('../authorize/client_credentials_authorize')

module.exports.main = co.wrap(function *() {
    var authorizes = []
    var grantType = this.checkQuery("grantType").default('accesstoken').value

    switch (grantType) {
        case 'accesstoken': //accessToken认证模式
            var clientId = this.checkQuery("clientId").notEmpty().toInt().value
            var accessToken = this.checkQuery("accessToken").notEmpty().value
            this.errors && this.validateError()
            authorizes.push(clientAuthorize.call(this, clientId))
            authorizes.push(tokenAuthorize.call(this, accessToken, clientId))
            break;
        case 'clientcredentials': //客户端认证模式
            var clientId = this.checkHeader("clientid").notEmpty().toInt().value
            var timeLine = this.checkHeader("timeline").notEmpty().toInt().value
            var sign = this.checkHeader("sign").notEmpty().value
            this.errors && this.validateError()
            if (Math.abs(moment().format('X') - timeLine) > 180) { //时间戳允许最大误差值为±180秒
                this.error("参数timeLine验证失败,请检查服务器时间", apiCodeEnum.errCodeEnum.clientCredentialsError, apiCodeEnum.retCodeEnum.oauthError)
            }
            authorizes.push(clientCredentialsAuthorize.call(this, clientId, timeLine, sign, this.request.url))
            break;
        default:
            this.error("不支持的授权模式," + grantType)
            break;
    }

    yield Promise.all(authorizes)

    return true;
})




