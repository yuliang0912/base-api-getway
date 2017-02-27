/**
 * Created by yuliang on 2017/2/17.
 */

"use strict"
const smsKnex = require('../../db_helper/knex').gwSms

module.exports = {
    getUser: function (condition) {
        return smsKnex('users').select().where(condition).first()
    }
}