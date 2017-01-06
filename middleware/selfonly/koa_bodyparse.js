/**
 * Created by yuliang on 2017/1/6.
 */

"use strict"

const koaBody = require('koa-body')

module.exports = function () {
    var options = {
        onError: function (err, ctx) {
            ctx.error("body解析错误:" + err.toString())
        }
    }
    return koaBody(options)
}
