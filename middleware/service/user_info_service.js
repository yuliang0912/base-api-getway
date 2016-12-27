/**
 * Created by yuliang on 2016/12/6.
 */

"use strict"
var knex = require('knex')
const userKnex = require('../../db_helper/knex').userInfo

module.exports = {
    getUserInfo: function (condition) {
        return userKnex('user_info').select().where(condition).first()
    },
    updateUserInfo: function (model, condition) {
        return userKnex('user_info').update(model).where(condition)
    }
}