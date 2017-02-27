/**
 * Created by yuliang on 2016/12/23.
 */
"use strict"

const co = require('co')
const Redis = require('ioredis')
const Promise = require('bluebird')
const log = require('../libs/log4').db
const redisConfit = require('../configs/main').redisConfig

var server, isReady = false;

if (redisConfit.isOpen) {
    redisConfit.connOptions.options.retryStrategy = function (times) {
        if (times <= 240) {
            log.getLogger().fatal("重连次数" + times)
            return times
        }
        server.disconnect()
        log.getLogger().fatal("redis将在1小时之后重新尝试建立连接")
        setTimeout(function () {
            log.getLogger().fatal("redis正在尝试重新建立连接")
            server = new Redis(redisConfit.connOptions.port,
                redisConfit.connOptions.host,
                redisConfit.connOptions.options)
        }, 1000 * 60 * 60)
    }

    server = new Redis(redisConfit.connOptions.port,
        redisConfit.connOptions.host,
        redisConfit.connOptions.options)

    listenEvent()
}


Redis.prototype.getBuiltinCommands().forEach(command=> {
    module.exports[command] = function () {
        if (!isReady || (server && server.status !== "ready")) {
            return Promise.reject(new Error("redis服务未打开"))
        }
        var args = Array.from(arguments)
        return server[command].apply(this, args).timeout(30000).catch(Promise.TimeoutError, ()=> {
            throw new Error("redis连接已超时")
        }).catch(err=> {
            log.getLogger().warn("=========redis应用错误:begin==============")
            log.getLogger().warn("redis应用错误[error]:" + err.toString())
            log.getLogger().warn("redis应用错误[command]:" + command)
            log.getLogger().warn("redis应用错误[params]:" + args.toString())
            log.getLogger().warn("=========redis应用错误:end==============")
            throw err
        })
    }
})

function listenEvent() {
    server.on("connect", function () {
        console.log("redis正在连接中...")
        log.getLogger().info("redis正在连接中...")
    })

    server.on("error", function (err) {
        isReady = false
        console.log("redis连接错误[error]:" + err.toString())
    })

    server.on("ready", function () {
        isReady = true
        console.log("redis连接已就绪...")
    })

    server.on('close', function () {
        isReady = false
        console.log("redis连接已关闭...")
    })

    server.on("reconnecting", function () {
        console.log("redis正在尝试重连...")
    })

    server.on("end", function () {
        console.log("redis连接已经释放")
    })
}





