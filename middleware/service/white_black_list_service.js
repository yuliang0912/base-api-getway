/**
 * Created by yuliang on 2016/12/12.
 */


"use strict"

const getwayKnex = require('../../db_helper/knex').apiGetway

module.exports = {
    getBwList: function (routeId, type) {
        return getwayKnex("bwList").where({routeId, type, status: 0}).select()
    }
}
