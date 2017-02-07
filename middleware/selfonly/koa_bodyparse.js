/**
 * Created by yuliang on 2017/1/6.
 */

"use strict"

const koaBody = require('koa-body')

module.exports = function (app) {
    return koaBody({multipart: false})
}
