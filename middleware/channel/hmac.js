/**
 * Created by yuliang on 2016/12/6.
 */

"use strict"

const co = require('co')
const clientAuthorize = require('../authorize/client_authorize')
const hmacSignAuthorize = require('../authorize/hmac_sign_authorize')

module.exports.main = co.wrap(function *() {

    var clientId = this.checkQuery("clientId").notEmpty().value
    var sign = this.checkQuery("sign").notEmpty().value
    this.errors && this.validateError()

    yield clientAuthorize.call(this, clientId).then(clientInfo=> {
        //此处需要考虑实际地址与代理地址的不同.后期修改
        var text = this.request.url.replace(/&sign=(\S)*/g, "")
        return hmacSignAuthorize.call(this, text, clientInfo.privateKey, sign)
    })

    return true;
})

function params(searchParams) {
    location.search.substr(1).split("&").map(parm=> {
        var arr = parm.split("=");
        return {key: arr[0], value: arr[1]}
    });
}

function parseQueryString(url) {
    var obj = {};
    var start = url.indexOf("?") + 1;
    var str = url.substr(start);
    var arr = str.split("&");
    for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split("=");
        obj[arr2[0]] = arr2[1];
    }
    return obj;
}