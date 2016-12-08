/**
 * Created by yuliang on 2016/12/5.
 */

var co = require('co')
var request = require('request')

module.exports = co.wrap(function *(ctx, next) {
    yield test().then(body=> {
        ctx.body = body
    })
})


function test() {
    return new Promise(function (resolve, reject) {
        request.get('http://eapi.ciwong.com/v5/userlogs/getLogs?userId=155014', {
            auth: {
                user: '155014',
                pass: '1',
                sendImmediately: true
            }
        }, function (err, response, body) {
            if (err) {
                return reject(err)
            }
            resolve(body)
        })
    })
}