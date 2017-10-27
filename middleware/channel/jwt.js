/**
 * Created by yuliang on 2017/8/7.
 */


"use strict"

const co = require('co')
const jwtAuthorize = require('../authorize/json_web_token_authorize')

module.exports.main = co.wrap(function*(ctx) {

    yield jwtAuthorize.call(this, ctx)

    return true
});