/**
 * Created by yuliang on 2016/12/7.
 */

"use strict"

const co = require('co')
const apiCode = require('../../libs/api_code_enum')
const userPwdAuthorize = require('./user_password_authorize')

module.exports = co.wrap(function*() {

    this.trackLog("开始进行basice64认证")

    this.authorize.flow.push('basice64')

    var authStr = this.header.authorization || "";
    var userPassRegExp = /^([\d]{5,12}?):(.*)$/; //5-12位数字账号
    var credentialsRegExp = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9\-\._~\+\/]+=*) *$/;
    var match = credentialsRegExp.exec(authStr);
    var userPass = match ? userPassRegExp.exec(new Buffer(match[1], 'base64').toString()) : null;

    if (!userPass) {
        this.response.status = 401;
        this.trackLog("basice64认证失败")
        this.error("未认证的请求", apiCode.errCodeEnum.basiceAuthError, apiCode.retCodeEnum.authenticationFailure)
    }

    var userId = parseInt(userPass[1])
    var passWord = userPass[2]

    yield userPwdAuthorize.call(this, userId, passWord)

    this.authorize.userId = userId;
    this.trackLog("basice64认证成功")
    return userId;
});