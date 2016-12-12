/**
 * Created by yuliang on 2016/12/6.
 */
"use strict"

const getwayKnex = require('../../db_helper/knex').apiGetway

module.exports = {
    getApiRoutes: function (routeUrl) {
        return getwayKnex("apiRoutes").where('routeUrl', 'like', routeUrl + '%').select()
    }
}