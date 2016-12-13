/**
 * Created by yuliang on 2016/12/1.
 */

"use strict"

const co = require('co')
const _ = require('lodash')
const Promise = require('bluebird')
const coms = require('./channel_com_center')
const routeAuthorize = require('./authorize/route_proxy_authorize')

const proxyService = require('./proxy/http_proxy/request-proxy')

module.exports = co.wrap(function *(ctx, next) {

    if (ctx.request.url === "/favicon.ico") {
        ctx.status = 200;
        return;
    }

    yield routeAuthorize.call(ctx)

    if (Array.isArray(ctx.authorize.proxyRoute.config.auth)) {
        var currApiCom = coms.channelComKeys.filter(t=>ctx.authorize.proxyRoute.config.auth.indexOf(t) > -1).map(com=> {
            return coms.channelCom[com].main.call(ctx, ctx)
        })
        yield Promise.all(currApiCom)
    }

    yield proxyService.call(ctx, ctx.authorize.proxyUrl)
})

