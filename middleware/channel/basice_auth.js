/**
 * Created by yuliang on 2016/12/6.
 */

"use strict"

const co = require('co')
const basice64Authorize = require('../authorize/basice64_authorize')

module.exports.main = co.wrap(function*() {

    yield basice64Authorize.call(this)

    return true
});