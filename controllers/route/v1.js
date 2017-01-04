/**
 * Created by yuliang on 2016/12/9.
 */

const apiGetwayService = require('../../middleware/service/api_getway_service')
const routeAuthorize = require('../../middleware/authorize/route_proxy_authorize')

module.exports = {
    getRoutes: function *() {
        var routeUrl = this.checkQuery('routeUrl').notEmpty().value;
        this.errors && this.validateError()

        if (!routeUrl.endsWith("/")) {
            routeUrl += '/';
        }

        yield apiGetwayService.getApiRoutes(routeUrl).then(this.success)
    },
    routeTest: function *() {

        yield routeAuthorize.call(this)

        this.success(this.authorize.proxyUrl)
    }
}