/**
 * Created by yuliang on 2016/12/4.
 */

"use strict"

const kenx = require('knex')
const log = require('../libs/log4').db

const dbConfig =
    process.env.NODE_ENV === 'production'
        ? require('./../configs/dbconfig_production.json')
        : process.env.NODE_ENV === 'test'
        ? require('./../configs/dbconfig_test.json')
        : require('./../configs/dbconfig_development.json')

const apiGetway = kenx({
    client: 'mysql2',
    connection: {
        host: dbConfig.apiGetway.config.host,
        user: dbConfig.apiGetway.username,
        password: dbConfig.apiGetway.password,
        database: dbConfig.apiGetway.database,
        charset: 'utf8'
    },
    pool: {
        min: dbConfig.apiGetway.config.minConnections,
        max: dbConfig.apiGetway.config.maxConnections,
    },
    acquireConnectionTimeout: dbConfig.apiGetway.config.maxIdleTime,
    debug: false // process.env.NODE_ENV !== 'production'
})


const userInfo = kenx({
    client: 'mysql2',
    connection: {
        host: dbConfig.userInfo.config.host,
        user: dbConfig.userInfo.username,
        password: dbConfig.userInfo.password,
        database: dbConfig.userInfo.database,
        charset: 'utf8'
    },
    pool: {
        min: dbConfig.userInfo.config.minConnections,
        max: dbConfig.userInfo.config.maxConnections,
    },
    acquireConnectionTimeout: dbConfig.userInfo.config.maxIdleTime,
    debug: false // process.env.NODE_ENV !== 'production'
})

const gwSms = kenx({
    client: 'mysql2',
    connection: {
        host: dbConfig.gwSms.config.host,
        user: dbConfig.gwSms.username,
        password: dbConfig.gwSms.password,
        database: dbConfig.gwSms.database,
        charset: 'utf8'
    },
    pool: {
        min: dbConfig.gwSms.config.minConnections,
        max: dbConfig.gwSms.config.maxConnections,
    },
    acquireConnectionTimeout: dbConfig.gwSms.config.maxIdleTime,
    debug: false // process.env.NODE_ENV !== 'production'
})

module.exports = {
    apiGetway: apiGetway,
    userInfo: userInfo,
    gwSms: gwSms
}

gwSms.on('query-error', function (error, obj) {
    log.getLogger().error("===========knex:gwSms error begin===============")
    log.getLogger().error(error.toString())
    log.getLogger().error(JSON.stringify(obj))
    log.getLogger().error("===========end===============")
})

userInfo.on('query-error', function (error, obj) {
    log.getLogger().error("===========knex:userInfo error begin===============")
    log.getLogger().error(error.toString())
    log.getLogger().error(JSON.stringify(obj))
    log.getLogger().error("===========end===============")
})

apiGetway.on('query-error', function (error, obj) {
    log.getLogger().error("===========knex:apiGateWay error begin===============")
    log.getLogger().error(error.toString())
    log.getLogger().error(JSON.stringify(obj))
    log.getLogger().error("===========end===============")
})