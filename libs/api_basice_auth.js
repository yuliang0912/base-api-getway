/**
 * Created by yuliang on 2016/6/11.
 */

"use strict"

const co = require('co');
const apiCode = require('./api_code_enum');

function notAuthorized(context) {
    context.response.status = 401;
    throw Object.assign(new Error("未认证的请求"),
        {
            retCode: apiCode.retCodeEnum.authenticationFailure,
            errCode: apiCode.errCodeEnum.refusedRequest
        });
}

module.exports = co.wrap(function*() {
    if (process.env.NODE_ENV !== 'production') {
        this.request.userId = 155014;
        return;
    }
    var authStr = this.header.authorization || "";

    /*用户ID必须是5到12位数的数字*/
    var userPassRegExp = /^([\d]{5,12}?):(.*)$/;
    var credentialsRegExp = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9\-\._~\+\/]+=*) *$/;
    var match = credentialsRegExp.exec(authStr);

    if (!match) {
        notAuthorized(this);
    }
    var userPass = userPassRegExp.exec(new Buffer(match[1], 'base64').toString());
    if (!userPass) {
        notAuthorized(this);
    }
    this.request.userId = parseInt(userPass[1]);
    this.isAuthenticated = true;
});
