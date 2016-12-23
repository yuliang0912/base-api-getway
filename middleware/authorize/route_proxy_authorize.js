/**
 * Created by yuliang on 2016/12/9.
 */

"use strict"

const co = require('co')
const _ = require('lodash')
const apiUtils = require('../../libs/api_utils')
const apiCode = require('../../libs/api_code_enum')
const apiGetwayService = require('../service/api_getway_service')


module.exports = co.wrap(function *() {

    var scheme = _.chain(this.path.toLowerCase().split('/'))
        .filter(t=>t.trim().length > 0)
        .take(2)
        .value()

    if (scheme.length < 2) {
        this.status = 404
        this.error("未能成功匹配路由,请检查配置", apiCode.errCodeEnum.notFoundAgentServerError, apiCode.retCodeEnum.agentError)
    }

    var routeKey = "/" + scheme.join("/") + "/"
    var proxyRoutes = yield apiGetwayService.getApiRoutes(this.headers.host, routeKey)
    if (proxyRoutes.length === 0) {
        this.error("未能成功匹配路由,请检查配置", apiCode.errCodeEnum.notFoundAgentServerError, apiCode.retCodeEnum.agentError)
    }

    var path = (this.path.endsWith("/") ? this.path : this.path + "/").toLocaleLowerCase();

    var route = _.chain(proxyRoutes).each(t=> {
        t.matchingValue = path.replace(t.routeUrl.toLocaleLowerCase(), "").length
    }).sortBy(t=>t.matchingValue).first().value()

    if (route.matchingValue == path.length) {
        this.status = 404
        this.error("未能成功匹配路由,请检查配置", apiCode.errCodeEnum.notFoundAgentServerError, apiCode.retCodeEnum.agentError)
    }

    route.config = JSON.parse(route.config);

    this.authorize.proxyRoute = route
    this.authorize.proxyUrl = parseUrl(route, this.url)

    return route
})

function parseUrl(route, currUrl) {
    var proxyUrl = "http://" + route.redirectHost;
    proxyUrl += currUrl.replace(new RegExp(route.routeUrl.trimEnd('/'), "i"), route.forwardUrl.trimEnd('/'))
    return proxyUrl
}