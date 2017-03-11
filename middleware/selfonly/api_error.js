/**
 * Created by yuliang on 2017/1/11.
 */


"use strict"
const co = require('co')
const apiCode = require('./../../libs/api_code_enum')
const log = require('../../libs/log4').koa

module.exports = function (app) {

    app.on('error', (err, ctx)=> {
        console.log("app-on-error事件:" + err.toString())
        log.getLogger().fatal("app-on-error事件:" + err.toString() + "ctx.request:" + JSON.stringify(ctx.request))
    })

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

process.once('unhandledRejection', function (err) {
    log.getLogger().warn("process-on-unhandledRejection事件:" + err.stack)
})

process.on('uncaughtException', function (err) {
    log.getLogger().fatal("process-on-uncaughtException事件:" + err.stack)
})