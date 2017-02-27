/**
 * Created by yuliang on 2017/1/6.
 */

"use strict"

const koaBody = require('koa-body')

module.exports = function (app) {
    var options = {
        jsonLimit: "1mb",
        formLimit: "256kb",
        textLimit: "256kb",
        encoding: "utf-8",
        multipart: false
    }
    return koaBody(options)
}
