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
    var proxyRoutes = yield apiGetwayService.getApiRoutes(routeKey)
    if (proxyRoutes.length === 0) {
        this.error("未能成功匹配路由,请检查配置", apiCode.errCodeEnum.notFoundAgentServerError, apiCode.retCodeEnum.agentError)
    }

    var path = this.path.endsWith("/") ? this.path : this.path + "/";

    var route = _.chain(proxyRoutes).each(t=> {
        t.matchingValue = path.replace(t.routeUrl, "").length
    }).sortBy(t=>t.matchingValue).first().value()

    if (route.matchingValue == path.length) {
        this.status = 404
        this.error("未能成功匹配路由,请检查配置", apiCode.errCodeEnum.notFoundAgentServerError, apiCode.retCodeEnum.agentError)
    }

    this.authorize.proxyRoute = route
    this.authorize.proxyUrl = buildUrl(route, this.url, this.search)
})

function buildUrl(route, currUrl, search) {
    var baseUrl = route.host;
    if (route.port > 0) {
        baseUrl += ":" + route.port;
    }
    if (route.type === 1) { //范围代理
        baseUrl += currUrl.replace(route.routeUrl, route.forwardUrl)
    }
    else if (route.type === 2) { //接口代理
        baseUrl += route.forwardUrl.trimEnd('/') + search
    }
    return baseUrl
}