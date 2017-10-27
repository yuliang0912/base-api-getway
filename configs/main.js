"use strict";
var path = require('path')

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 1201

var host = 'http://localhost' + (port != 80 ? ':' + port : '');

var DEBUG = env !== 'production'

module.exports = {
    name: "cw-api-getway",
    keys: ['87b6a58e4d127b89373df32dcbb0fde22b0c52ce'],
    env: env,
    port: port,
    static: {
        directory: path.resolve(__dirname, '../public')
    },
    bodyparser: {},
    auth: {},
    view: {
        root: path.resolve(__dirname, '../web'),
        cache: DEBUG ? false : 'memory',
    },
    redisConfig: {
        isOpen: true,
        connOptions: {
            host: '192.168.2.111',
            port: 6379,
            options: {
                connectTimeout: 5000,
                lazyConnect: false,
                keyPrefix: "cw_api_gateway_"
            }
        },
    },
}