/**
 * Created by yuliang on 2016/12/9.
 */

const apiGetwayService = require('../../middleware/service/api_getway_service')

module.exports = {
    getRoutes: function *() {
        var routeUrl = this.checkQuery('routeUrl').notEmpty().value;
        this.errors && this.validateError()

        if (!routeUrl.endsWith("/")) {
            routeUrl += '/';
        }

        yield apiGetwayService.getApiRoutes(routeUrl).then(this.success)
    },
    routeTest: function () {

    }
}