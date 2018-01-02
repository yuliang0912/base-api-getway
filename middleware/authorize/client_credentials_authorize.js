/**
 * Created by yuliang on 2017-05-02.
 * 新增服务端秘钥认证
 */

const co = require('co')
const clientAuthorize = require('./client_authorize')
const hmacSignAuthorize = require('./hmac_sign_authorize')

module.exports = co.wrap(function* (clientId, timeLine, sign, url) {
    this.authorize.flow.push('clientCredentials')
    this.trackLog("开始进行clientCredentials认证")

    yield clientAuthorize.call(this, clientId).then(clientInfo => {
        var text = url + "&timeline=" + timeLine
        return hmacSignAuthorize.call(this, text, clientInfo.privateKey, sign)
    })

    try {
        let tokenInfo = this.get('authentication')
        this.authorize.clientTokenInfo = JSON.parse(new Buffer(tokenInfo, 'base64').toString())
    } catch (e) {
    }

    return true
})