/**
 * Created by yuliang on 2016/12/6.
 */
"use strict"

const co = require('co')

module.exports.main = co.wrap(function *() {
    //throw new Error(ctx.request.url)
    return 2;
});