/**
 * Created by yuliang on 2016/12/9.
 */

"use strict"

const co = require('co')
const apiCode = require('../../libs/api_code_enum')
const whiteBlackListService = require('../service/white_black_list_service')

module.exports = co.wrap(function*(routeId, host) {
    this.authorize.flow.push('whiteList')

    var whiteList = yield whiteBlackListService.getBwList(routeId, 2);

    if (!whiteList.some(t=>t.host === host)) {
        this.error("没有访问权限", apiCode.errCodeEnum.whiteListError, apiCode.retCodeEnum.authenticationFailure)
    }
})