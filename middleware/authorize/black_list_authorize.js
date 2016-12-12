/**
 * Created by yuliang on 2016/12/9.
 */

"use strict"

const co = require('co')
const apiCode = require('../../libs/api_code_enum')

module.exports = co.wrap(function*() {
    this.authorize.flow.push('blackList')
})