/**
 * Created by yuliang on 2016/12/26.
 */

'use strict'

const log4js = require('koa-log4')

const config = process.env.NODE_ENV === 'production'
    ? require("../configs/log4_production.js")
    : require("../configs/log4_development.js")

log4js.configure(config.generic);
log4js.loadAppender('dateFile');
log4js.loadAppender('file');

config.category.appenders.forEach(item=> {
    let logInstance
    module.exports[item.category] = {
        getLogger: function () {
            if (!logInstance) {
                if (item.type === "dateFile") {
                    log4js.addAppender(log4js.appenders.dateFile(item.filename, item.pattern, undefined, item), item.category);
                } else if (item.type === "file") {
                    log4js.addAppender(log4js.appenders.file(item.filename, undefined, item.maxLogSize, item.backups, item), item.category);
                }
                logInstance = log4js.getLogger(item.category)
                logInstance.setLevel(item.level || "all")
            }
            return logInstance
        }
    }
})






