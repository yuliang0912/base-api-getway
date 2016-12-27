/**
 * Created by yuliang on 2016/12/26.
 */

'use strict'

var logList = {}
const log4js = require('koa-log4')


log4js.configure(process.env.NODE_ENV === 'production'
    ? "configs/log4_production.json"
    : "configs/log4_development.json")

module.exports = function (logName) {
    if (logName === null || logName === undefined) {
        throw Error('logName is NotDefined')
    }
    if (logList[logName]) {
        return logList[logName]
    }
    logList[logName] = log4js.getLogger(logName)
    return logList[logName]
}
