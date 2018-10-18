/**
 * Created by yuliang on 2016/12/1.
 */

"use strict"

const co = require('co')
const _ = require('lodash')
const Promise = require('bluebird')
const coms = require('./channel_com_center')
const proxyService = require('./proxy/request')
const routeAuthorize = require('./authorize/route_proxy_authorize')

module.exports = co.wrap(function *(ctx, next) {

    //暂时允许跨域请求
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set("Access-Control-Allow-Credentials", "true")
    // ctx.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    // ctx.set("Access-Control-Allow-Headers", "authorization,x-requested-with,content-type")

    ctx.trackLog("进入代理主流程")

    var routeInfo = yield routeAuthorize.call(ctx)

    if (routeInfo && Array.isArray(routeInfo.config.auth)) {
        var currApiCom = coms.channelComKeys.filter(t => routeInfo.config.auth.indexOf(t) > -1).map(com => {
            return coms.channelCom[com].main.call(ctx, ctx)
        })
        yield Promise.all(currApiCom)
    }


    var ms = Date.now()
    yield proxyService.call(ctx)
    ctx.set("Original-Agent-Time", (Date.now() - ms))

    // //此处做善后处理,例如
    // debug("====本次代理信息start=====")
    // debug("原始请求地址:http://" + ctx.headers.host + ctx.url)
    // debug("实际代理地址:" + ctx.authorize.proxyUrl)
    // debug("本次代理认证流程:" + ctx.authorize.flow)
    // debug("本次源服务器响应用时:" + (msEnd - ms))
    // debug("====本次代理信息end=====")

    ctx.trackLog("代理主流程结束")
})

