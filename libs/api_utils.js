/**
 * Created by Administrator on 2016/7/8 0008.
 */

'use strict'

var uuid = require('node-uuid');
var crypto = require('crypto')

var utils = module.exports = {};

utils.pm2 = {
    isPm2Server: process.env._pm2_version !== undefined && process.env.pm_id >= 0,
    pm2WorkId: process.env.pm_id
}

utils.crypto = {
    sha512: function (text, digest = "hex") {
        return crypto.createHash('sha512').update(text).digest(digest)
    },
    hmacSha1: function (text, key, digest = "hex") {
        return crypto.createHmac('sha1', key).update(text).digest(digest)
    },
    md5: function (text) {
        return crypto.createHash('md5').update(text).digest('hex')
    },
    rsaSha256Verify(text, sign, publickKey, digest = "hex") {
        let verify = crypto.createVerify('RSA-SHA256');
        verify.update(text)
        return verify.verify(publickKey, sign, digest);
    },
    base64Decode(text) {
        return new Buffer(text, 'base64').toString()
    },
    base64Encode(text){
        return new Buffer(text).toString("base64")
    }
}


utils.isEmptyObject = function (obj) {
    if (!obj || !(obj instanceof Object)) {
        return false
    }
    return Object.keys(obj).length === 0
}

utils.createInt16Number = function () {
    return Math.floor(Math.random() * 10000000000000000);
}

utils.getUuid = function () {
    return uuid.v4();
}

utils.get64RandomStr = function () {
    return (uuid.v4() + uuid.v4()).replace(/-/g, "")
}

utils.isNullOrUndefined = function (str) {
    return str === undefined || str === null;
}

utils.convert = function (model) {
    var type = toString.call(model)
    if (type === '[object Object]') {
        Object.keys(model).forEach(item => {
            if (toString.call(model[item]) === '[object Date]') {
                model[item] = model[item].toUnix()
            }
        });
    } else if (type === '[object Date]') {
        model = model.toUnix()
    } else if (type === '[object Array]') {
        model.forEach(utils.convert)
    }
    return model
}

utils.convertToPage = function (page, pageSize, totalItem, pageList) {
    return {
        page,
        pageSize,
        totalCount: totalItem,
        pageCount: Math.ceil(totalItem / pageSize),
        pageList: pageList
    }
}

String.prototype.curString = function (length, additional = '', startIndex = 0) {
    return this.length > length
        ? this.substr(startIndex, length) + additional
        : this.substr(startIndex, length)
}

String.prototype.trimStart = function (trimStr) {
    if (!trimStr) {
        return this;
    }
    var temp = this;
    while (true) {
        if (temp.substr(0, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(trimStr.length);
    }
    return temp;
}

String.prototype.trimEnd = function (trimStr) {
    if (!trimStr) {
        return this;
    }
    var temp = this;
    while (true) {
        if (temp.substr(temp.length - trimStr.length, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(0, temp.length - trimStr.length);
    }
    return temp;
}

Array.prototype.groupBy = function (key) {
    var batchGroup = {};
    this.forEach(item => {
        if (!batchGroup[item[key]]) {
            batchGroup[item[key]] = [];
        }
        batchGroup[item[key]].push(item);
    })
    return Object.keys(batchGroup).map(item => {
        return {key: item, value: batchGroup[item]}
    });
}

Date.prototype.toUnix = function () {
    return this.valueOf() / 1000;
}