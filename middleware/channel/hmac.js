/**
 * Created by yuliang on 2016/12/6.
 */

const co = require('co')
const clientAuthorize = require('../authorize/client_authorize')
const hmacSignAuthorize = require('../authorize/hmac_sign_authorize')

module.exports.main = co.wrap(function *() {

    var clientId = this.checkQuery("clientId").notEmpty().value
    var sign = this.checkQuery("sign").notEmpty().value
    this.errors && this.validateError()

    yield clientAuthorize.call(this, clientId)

    var text = this.request.url.replace(/&sign=(\S)*/g, "")

    yield hmacSignAuthorize.call(this, text, this.authorize.clientInfo.privateKey, sign)
});