/**
 * Created by yuliang on 2016/12/13.
 */

"use strict"

const co = require('co')
const whiteListAuthorize = require('../authorize/white_list_authorize')

module.exports.main = co.wrap(function *() {

    var ipAddress = this.request.ip.replace("::ffff:", "")

    yield whiteListAuthorize.call(this, this.authorize.proxyRoute.routeId, ipAddress)

    return true;
})