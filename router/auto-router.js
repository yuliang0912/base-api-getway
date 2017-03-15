/**
 * Created by yuliang on 2016/12/5.
 */

"use strict"

const co = require('co')
const fs = require('fs')
const path = require('path')
const ctrlPath = '../controllers'
const apiCode = require('../libs/api_code_enum')

var apiCtrollers = {}

fs.readdirSync(path.join(__dirname, ctrlPath)).forEach(ctrlName=> {
    ctrlName = ctrlName.toLowerCase()
    apiCtrollers[ctrlName] = {}

    fs.readdirSync(path.join(__dirname, ctrlPath, ctrlName)).forEach(versionName=> {
        versionName = versionName.toLowerCase().replace('.js', '')
        apiCtrollers[ctrlName][versionName] = {}

        let actions = require(path.join(__dirname, ctrlPath, ctrlName, versionName))
        Object.keys(actions).forEach(actionName=> {
            if (toString.call(actions[actionName]) === "[object GeneratorFunction]") {
                apiCtrollers[ctrlName][versionName][actionName.toLowerCase()] = actions[actionName];
            }
        })
    })
})

apiCtrollers = Object.freeze(apiCtrollers)


module.exports = co.wrap(function *(ctx) {

    ctx.trackLog("开始自动匹配路由")

    let scheme = ctx.path.toLowerCase().split('/').filter(item=> item.trim().length > 0);

    if (scheme.length <= 1) {
        throw Object.assign(new Error("未找到指定的接口"),
            {errCode: apiCode.errCodeEnum.notFoundController});
    }

    if (scheme.length == 2) {
        scheme.splice(1, 0, "v1");
    }

    let controller = apiCtrollers[scheme[0]];
    if (!controller) {
        throw Object.assign(new Error("未找到指定的接口"),
            {errCode: apiCode.errCodeEnum.notFoundController});
    }

    let version = controller[scheme[1]]
    if (!version) {
        throw Object.assign(new Error("未找到指定的接口"),
            {errCode: apiCode.errCodeEnum.notFoundApiVersion});
    }

    let action = version[scheme[2]]
    if (!action) {
        throw Object.assign(new Error("未找到指定的接口"),
            {errCode: apiCode.errCodeEnum.notFoundApiAction});
    }

    ctx.trackLog("自动匹配路由成功")

    //暂时允许跨域请求
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set("Access-Control-Allow-Credentials", "true")
    ctx.set("Access-Control-Allow-Methods", "*")

    yield action.call(ctx)
})