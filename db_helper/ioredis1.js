/**
 * Created by yuliang on 2016/12/23.
 */
"use strict"

const co = require('co')
const Redis = require('ioredis')
const Promise = require('bluebird')
const log = require('../libs/log4').db
const redisConfit = require('../configs/main').redisConfig

var clientInfo = {
    client: undefined,
    isOpen: false,
    isReady: redisConfit.isOpen
}

// var commands = Redis.prototype.getBuiltinCommands()
// Object.keys(Redis.prototype).forEach(action=> {
//     module.exports[action] = co.wrap(function *() {
//         var client = yield getClient()
//         var args = Array.from(arguments)
//         return client[action](args).timeout(1000).catch(Promise.TimeoutError, ()=> {
//             return Promise.reject("redis连接已超时")
//         }).catch(err=> {
//             log.getLogger().warn("=========redis应用错误:begin==============")
//             log.getLogger().warn("redis应用错误[error]:" + err.toString())
//             log.getLogger().warn("redis应用错误[command]:" + action)
//             log.getLogger().warn("redis应用错误[params]:" + args.toString())
//             log.getLogger().warn("=========redis应用错误:end==============")
//             return err
//         })
//     })
// })
//

Redis.prototype.getBuiltinCommands().forEach(command=> {
    module.exports[command] = co.wrap(function *() {
        var client = yield getClient()

        var args = Array.from(arguments)

        return client[command](args).timeout(30000).catch(Promise.TimeoutError, ()=> {
            return Promise.reject("redis连接已超时")
        }).catch(err=> {
            log.getLogger().warn("=========redis应用错误:begin==============")
            log.getLogger().warn("redis应用错误[error]:" + err.toString())
            log.getLogger().warn("redis应用错误[command]:" + command)
            log.getLogger().warn("redis应用错误[params]:" + args.toString())
            log.getLogger().warn("=========redis应用错误:end==============")
            return err
        })
    })
})


var getClient = co.wrap(function () {
    if (!clientInfo.isReady) {
        return Promise.reject(new Error("redis服务未打开"))
    }
    else if (clientInfo.client) {
        return clientInfo.client;
    }
    return createClient()
})


var createClient = function () {
    return new Promise(function (resolve, reject) {
        clientInfo.isReady = false

        //每15秒尝试重连一次,尝试连接1个小时,依然连接不上,则间隔1小时之后重试
        redisConfit.connOptions.options.retryStrategy = function (times) {
            if (times <= 240) {
                log.getLogger().fatal("重连次数" + times)
                return times
            }
            clientInfo.client.disconnect()
            log.getLogger().fatal("redis将在1小时之后重新尝试建立连接")
            setTimeout(function () {
                log.getLogger().fatal("redis正在尝试重新建立连接")
                clientInfo.client = new Redis(redisConfit.connOptions.port, redisConfit.connOptions.host, redisConfit.connOptions.options)
                listenEvent(clientInfo.client, resolve, reject)
            }, 1000 * 60 * 60)
        }

        clientInfo.client = new Redis(redisConfit.connOptions.port, redisConfit.connOptions.host, redisConfit.connOptions.options)
        listenEvent(clientInfo.client, resolve, reject)
    })
}

function listenEvent(server, resolve, reject) {
    server.on("connect", function () {
        log.getLogger().info("redis正在连接中...")
    })

    server.on("error", function (err) {
        reject(err)
        clientInfo.isReady = false
        log.getLogger().fatal("redis连接错误[error]:" + err.toString())
    })

    server.on("ready", function () {
        resolve(server)
        clientInfo.isReady = true
        log.getLogger().info("redis连接已就绪...")
    })

    server.on('close', function () {
        clientInfo.isReady = false
        log.getLogger().fatal("redis连接已关闭...")
    })

    server.on("reconnecting", function () {
        log.getLogger().warn("redis正在尝试重连...")
    })

    server.on("end", function () {
        log.getLogger().warn("redis连接已经释放")
    })
}





