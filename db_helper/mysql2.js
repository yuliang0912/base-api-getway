/**
 * Created by yuliang on 2016/12/29.
 */

"use strict"

const mysql = require('mysql2/promise')

const dbConfig =
    process.env.NODE_ENV === 'production'
        ? require('./../configs/dbconfig_production.json')
        : process.env.NODE_ENV === 'test'
        ? require('./../configs/dbconfig_test.json')
        : require('./../configs/dbconfig_development.json')

var userInfoPool = mysql.createPool({
    host: dbConfig.userInfo.config.host,
    user: dbConfig.userInfo.username,
    password: dbConfig.userInfo.password,
    database: dbConfig.userInfo.database,
    charset: 'utf8',
    connectionLimit: dbConfig.userInfo.config.minConnections,
    acquireTimeout: dbConfig.userInfo.config.maxIdleTime
})

var apiGateWay = mysql.createPool({
    host: dbConfig.apiGetway.config.host,
    user: dbConfig.apiGetway.username,
    password: dbConfig.apiGetway.password,
    database: dbConfig.apiGetway.database,
    charset: 'utf8',
    connectionLimit: dbConfig.apiGetway.config.maxConnections,
    acquireTimeout: dbConfig.apiGetway.config.maxIdleTime
})

module.exports = {
    userInfo: function () {
        return userInfoPool.getConnection()
    },
    apiGateWay: function () {
        return apiGateWay.getConnection()
    }
}

