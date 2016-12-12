/**
 * Created by yuliang on 2016/12/5.
 */

"use strict"

const co = require('co')
const fs = require('fs')
const path = require('path')
const ctrlPath = '../controllers'
const router = require('koa-router')()
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

var autoRouter = co.wrap(function *(ctx) {
    let scheme = ctx.path.toLowerCase().split('/').filter(item=> item.trim().length > 0);

    if (scheme.length <= 1) {
        ctx.body = 'welcome to cw-api-getway'
        return;
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

    yield action.call(ctx)
})

module.exports = function (app) {

    router.get('/', co.wrap(function *(ctx, next) {
        ctx.body = "welcome to cw-api-getway"
    }))

    router.all('/(oauth|route)/*', autoRouter)

    router.all('/*', require('../middleware/process_center'))

    app.use(router.routes()).use(router.allowedMethods())
}