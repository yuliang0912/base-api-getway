/**
 * Created by yuliang on 2017/1/16.
 */

var pm2WorkId = process.env.pm_id === undefined
    ? "" : "-" + process.env.pm_id;


var genericConfig = {
    appenders: [
        {
            type: "console",
            category: "console"
        }
    ],
    replaceConsole: true
}

var category = {
    appenders: [
        {
            type: "dateFile",
            filename: "logs/koa/",
            alwaysIncludePattern: true,
            pattern: "log-yyyy-MM-dd" + pm2WorkId + ".log",
            category: "koa",
            level: "all"
        },
        {
            type: "dateFile",
            filename: "logs/db/",
            alwaysIncludePattern: true,
            pattern: "log-yyyy-MM-dd" + pm2WorkId + ".log",
            category: "db",
            level: "all"
        },
        {
            type: "dateFile",
            filename: "logs/track/",
            alwaysIncludePattern: true,
            pattern: "log-yyyy-MM-dd" + pm2WorkId + ".log",
            category: "track",
            level: "all"
        },
        {
            type: "dateFile",
            filename: "logs/login/",
            alwaysIncludePattern: true,
            pattern: "log-yyyy-MM-dd" + pm2WorkId + ".log",
            category: "login",
            level: "all"
        }]
};

module.exports = {
    generic: genericConfig,
    category: category
}