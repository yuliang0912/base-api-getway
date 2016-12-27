/**
 * Created by yuliang on 2016/12/9.
 */

"use strict"

const co = require('co')
const apiCode = require('../../libs/api_code_enum')
const whiteBlackListService = require('../service/white_black_list_service')

module.exports = co.wrap(function*(routeId, host) {

    this.trackLog("开始进行黑名单认证")
    this.authorize.flow.push('blackList')

    var blackList = yield whiteBlackListService.getBwList(routeId, 1);

    if (blackList.some(t=>t.host === host)) {
        this.trackLog("黑名单认证失败")
        this.error("没有访问权限", apiCode.errCodeEnum.blackListError, apiCode.retCodeEnum.authenticationFailure)
    }
    this.trackLog("黑名单认证通过")
    return true
})