/**
 * Created by yuliang on 2016/12/1.
 */

"use strict"

const co = require('co')
const _ = require('lodash')
const Promise = require('bluebird')
const coms = require('./channel_com_center')
const proxyCore = require('./proxy/route_core')

module.exports = co.wrap(function *(ctx, next) {

    if (ctx.request.url === "/favicon.ico") {
        ctx.status = 200;
        return;
    }

    var apiCom = "oauth"

    var currApiCom = coms.channelComKeys.filter(t=>apiCom.indexOf(t) > -1).map(com=> {
        return coms.channelCom[com].main.call(ctx, ctx)
    })

    yield Promise.all(currApiCom)
    yield proxyCore.call(ctx).then(next)
})

