/**
 * Created by yuliang on 2016/6/10.
 */

"use strict"
const co = require('co')
const _ = require('lodash')
const knexLog = require('../../libs/log4')('db')
const trackLog = require('../../libs/log4')('track')
const apiCode = require('./../../libs/api_code_enum')

var hostIpAddress;

function buildReturnObject(ret, errCode, msg, data) {
    var result = {ret: apiCode.retCodeEnum.success, errcode: apiCode.errCodeEnum.success, msg: "success"};
    if (_.isNumber(ret)) {
        result.ret = ret;
    }
    if (_.isNumber(errCode)) {
        result.errcode = parseInt(errCode);
    }
    result.msg = (msg || "success").toString();

    if (!Object.is(data, undefined)) {
        result.data = data;
    }

    return result;
}

function getIPAdress() {
    if (!hostIpAddress) {
        var interfaces = require('os').networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4') {
                    hostIpAddress = alias.address;
                }
            }
        }
    }
    return hostIpAddress;
}

//定义apiResponse的输出响应结果
module.exports = function (app) {
    return co.wrap(function *(ctx, next) {
        //是否是跟踪模式
        let ISTRACK = ctx.headers['track-log'] === "true"

        ctx.success = (data) => {
            ctx.body = buildReturnObject(apiCode.retCodeEnum.success, apiCode.errCodeEnum.success, 'success', data);
            return;
        };

        ctx.error = (msg, errCode = apiCode.errCodeEnum.apiError, retCode = apiCode.retCodeEnum.serverError) => {
            throw Object.assign(new Error(msg || '接口口内部异常'),
                {retCode: retCode, errCode: _.isNumber(errCode) ? errCode : apiCode.errCodeEnum.apiError});
        };

        ctx.validateError = function () {
            var msg = "参数校验失败,details:" + JSON.stringify(this.errors);
            throw Object.assign(new Error(msg),
                {errCode: apiCode.errCodeEnum.paramTypeError});
        };

        ctx.allow = (passMethod = 'GET')=> {
            var validateResult = false;
            if (_.isString(passMethod)) {
                passMethod = passMethod.toUpperCase();
                validateResult = passMethod === 'ALL' || this.method === passMethod;
            }
            else if (Array.isArray(passMethod)) {
                validateResult = passMethod.some(item => item.toUpperCase() === this.method);
            }
            if (!validateResult) {
                throw Object.assign(new Error("接口不支持" + this.method + "请求"),
                    {errCode: apiCode.errCodeEnum.refusedRequest});
            }
            return this;
        }

        ctx.allowJson = (()=> {
            if (ctx.headers['content-type'] !== 'application/json') {
                ctx.error('content-type错误,必须是application/json');
            }
            return ctx;
        })

        //追踪记录
        ctx.trackLog = ((data)=> {
            ISTRACK && trackLog.trace(data)
        })

        ctx.authorize = {flow: []} //此处存放验证相关的信息

        ISTRACK && ctx.trackLog("====start:开始本次请求跟踪====")
        ISTRACK && ctx.trackLog("当前URL:" + ctx.url)

        try {
            ctx.set("X-Agent-Response-For", getIPAdress())
            yield next()
            if (ctx.response.status === 404 && ctx.body === undefined) {
                ctx.body = buildReturnObject(apiCode.retCodeEnum.success,
                    apiCode.errCodeEnum.notReturnData, 'success', null)
            }
            ISTRACK && ctx.trackLog("响应数据:" + JSON.stringify(ctx.body))
            ISTRACK && ctx.trackLog("====end:结束本次请求跟踪====")
        } catch (e) {
            if (e === undefined || e === null) {
                e = new Error("未定义的错误")
            }
            else if (e.fatal && e.code && e.errno) { //knex相关错误
                knexLog.fatal(e.toString())
            }

            ctx.body = buildReturnObject(e.retCode || apiCode.retCodeEnum.serverError,
                e.errCode || apiCode.errCodeEnum.autoSnapError, e.toString());

            ISTRACK && ctx.trackLog("出现异常错误:" + e.toString())
            ISTRACK && ctx.trackLog("====end:结束本次请求跟踪====")
        }
    })
}






