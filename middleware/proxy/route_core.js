/**
 * Created by yuliang on 2016/12/8.
 */

const co = require('co')
const _ = require('lodash')
const apiCode = require('../../libs/api_code_enum')

var proxyRoutes = [
    {
        route: "/v1/class/relation/",
        host: "http://127.0.0.1",
        port: 8896,
        forwardUrl: "/",
        type: 1, //范围
        coms: ["oauth"]
    },
    {
        route: "/v1/class/relation/classInfo",
        host: "http://127.0.0.1",
        port: 8896,
        type: 2, //具体接口
        forwardUrl: "/class/getClassInfo",
        coms: ["basice"]
    },
    {
        route: "/v1/class/relation/agent/",
        host: "http://127.0.0.1",
        port: 8896,
        type: 1,
        forwardUrl: "/",
        coms: ["transparent"]
    }
]

function buildUrl(route, currUrl, search) {


    var baseUrl = route.host;
    if (route.port > 0) {
        baseUrl += ":" + route.port;
    }
    if (route.type === 1) {
        baseUrl += currUrl.replace(route.route, route.forwardUrl)
    }
    else if (route.type === 2) {
        baseUrl += route.forwardUrl + search
    }
    return baseUrl
}

var proxyService = require('./http_proxy/request-proxy')
module.exports = co.wrap(function *() {

    var path = this.path + "/"
    var route = _.chain(proxyRoutes).each(t=>t.matchingValue = path.replace(t.route, "").length)
        .sortBy(t=>t.matchingValue)
        .first()
        .value()

    if (route.matchingValue == path.length) {
        this.status = 404
        this.error("未能成功匹配路由,请检查配置", apiCode.errCodeEnum.notFoundAgentServerError, apiCode.retCodeEnum.agentError)
    }
    yield proxyService.call(this, "http://eapi.ciwong.com/v5/userlogs/getLogs?userId=155014")
    //this.success(buildUrl(route, this.url, this.search))
})