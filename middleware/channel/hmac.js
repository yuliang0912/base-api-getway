/**
 * Created by yuliang on 2016/12/6.
 */

"use strict"

const co = require('co')
const clientAuthorize = require('../authorize/client_authorize')
const hmacSignAuthorize = require('../authorize/hmac_sign_authorize')

module.exports.main = co.wrap(function *() {
    var clientId = this.checkQuery("clientId").notEmpty().value
    var sign = this.checkQuery("sign").notEmpty().value
    this.errors && this.validateError()

    yield clientAuthorize.call(this, clientId).then(clientInfo=> {
        var text = Object.keys(this.request.query).filter(t=>t !== "sign").sort().map(t=> {
            return t + "=" + this.request.query[t]
        }).join("&")
        return hmacSignAuthorize.call(this, text, clientInfo.privateKey, sign)
    })

    return true;
})
