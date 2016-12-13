/**
 * Created by yuliang on 2016/12/6.
 */

"use strict"

const co = require('co')
const clientAuthorize = require('../authorize/client_authorize')
const tokenAuthorize = require('../authorize/token_authorize')

module.exports.main = co.wrap(function *() {
    var clientId = this.checkQuery("clientId").notEmpty().value
    var accessToken = this.checkQuery("accessToken").notEmpty().value
    this.errors && this.validateError()

    var clientAsync = clientAuthorize.call(this, clientId)
    var tokenAsync = tokenAuthorize.call(this, accessToken)

    yield Promise.all([clientAsync, tokenAsync])
    return true;
})




