/**
 * Created by yuliang on 2016/12/1.
 */

"use strict"

const co = require('co')
const _ = require('lodash')
const Promise = require('bluebird')
const coms = require('./channel_com_center')
const routeAuthorize = require('./authorize/route_proxy_authorize')

const proxyService = require('./proxy/request-proxy')
//const proxyService = require('./proxy/http-proxy')

module.exports = co.wrap(function *(ctx, next) {
    yield routeAuthorize.call(ctx)

    if (Array.isArray(ctx.authorize.proxyRoute.config.auth)) {
        var currApiCom = coms.channelComKeys.filter(t=>ctx.authorize.proxyRoute.config.auth.indexOf(t) > -1).map(com=> {
            return coms.channelCom[com].main.call(ctx, ctx)
        })
        yield Promise.all(currApiCom)
    }

    var ms = Date.now()
    yield proxyService.call(ctx)
    var msEnd = Date.now()

    //此处做善后处理,例如
    console.log("====本次代理信息start=====")
    console.log("原始请求地址:http://" + ctx.headers.host + ctx.url)
    console.log("实际代理地址:" + ctx.authorize.proxyUrl)
    console.log("本次代理认证流程:" + ctx.authorize.flow)
    console.log("本次源服务器响应用时:" + (msEnd - ms))
    console.log("====本次代理信息end=====")
})

