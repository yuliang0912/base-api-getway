/**
 * Created by yuliang on 2016/12/23.
 */

"use strict"

var redis = require('ioredis')
var Promise = require('bluebird')
var client = new redis()

module.exports = function () {
    return function () {
        if (client) {
            return client
        }
        return Promise.reject()
    }
}
    


