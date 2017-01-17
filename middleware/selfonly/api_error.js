/**
 * Created by yuliang on 2017/1/11.
 */


"use strict"
const co = require('co')
const apiCode = require('./../../libs/api_code_enum')
const log = require('../../libs/log4').koa

module.exports = function (app) {
    return co.wrap(function *(ctx, next) {
        try {
            yield next()
        } catch (e) {
            ctx.body = {
                ret: apiCode.retCodeEnum.serverError,
                errcode: apiCode.errCodeEnum.autoSnapError,
                msg: e ? e.toString() : "未定义的错误"
            }
            log.getLogger().error(e.toString())
        }
    })
}