"use strict"

const co = require('co')
const jwtOrNullAuthorize = require('../authorize/json_web_token_null_authorize')

module.exports.main = co.wrap(function*(ctx) {

    yield jwtOrNullAuthorize.call(this, ctx)

    return true
});