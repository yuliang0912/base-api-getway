/**
 * Created by yuliang on 2016/12/5.
 */

const co = require('co')
const proxy = require('node-fetch')
var extend = require('util')._extend


module.exports = co.wrap(function *(ctx, next) {
    yield proxy('http://127.0.0.1:8896/school/getSchoolList?schoolArea=44&page=1&pageSize=10').then(res=> {
        console.log(Buffer.isBuffer(res.body))
    })
    yield next()
})
