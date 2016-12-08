/**
 * Created by yuliang on 2016/12/4.
 */

"use strict"

const dbConfig = process.env.NODE_ENV === 'production'
    ? require('./../configs/dbconfig_production.json')
    : require('./../configs/dbconfig_development.json')

const apiGetway = require('knex')({
    client: 'mysql',
    connection: {
        host: dbConfig.apiGetway.config.host,
        user: dbConfig.apiGetway.username,
        password: dbConfig.apiGetway.password,
        database: dbConfig.apiGetway.database
    },
    pool: {
        min: dbConfig.apiGetway.config.minConnections,
        max: dbConfig.apiGetway.config.maxConnections,
    },
    acquireConnectionTimeout: dbConfig.apiGetway.config.maxIdleTime,
    debug: false // process.env.NODE_ENV !== 'production'
})

module.exports = {
    apiGetway: apiGetway
}