/**
 * Created by yuliang on 2016/12/12.
 */

const co = require('co')
const apiCode = require('../../libs/api_code_enum')

module.exports = co.wrap(function*(host) {
    this.authorize.flow.push('rateLimit')

    return true
})