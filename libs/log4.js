/**
 * Created by yuliang on 2016/12/26.
 */

'use strict'

const fs = require('fs')
const log4js = require('koa-log4')
const config = process.env.NODE_ENV === 'production'
    ? require("../configs/log4_production.json")
    : require("../configs/log4_development.json")

//const config = require("../configs/log4_production.json");

// if (!fs.existsSync("logs")) {
//     fs.mkdir("logs")
// }

var logs = module.exports = {}

log4js.configure(config)

config.appenders.forEach(log=> {
    // if (log.category === "console" || fs.exists("logs/" + log.category)) {
    //     return;
    // }
    // fs.mkdir("logs/" + log.category)

    logs[log.category] = log4js.getLogger(log.category)
})






