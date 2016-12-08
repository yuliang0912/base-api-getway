/**
 * Created by yuliang on 2016/12/1.
 */

const co = require('co')
const httpProxy = require('http-proxy')
const Promise = require('bluebird')
const proxy = httpProxy.createProxyServer();

module.exports = co.wrap(function *(ctx,next) {
    function proxyWeb() {
        return new Promise(function (resolve, reject) {
            proxy.web(ctx.req, ctx.res, {
                target: 'http://eapi.ciwong.com/v5/userlogs/getLogs?userId=155014&'
                //forward: 'http://www.ciwong.com'
            }, function (e) {
                reject(e);
            });

            proxy.on('proxyRes', function (proxyRes, req, res, options) {
                resolve(res);
            });

            proxy.on('error', function (e) {
                reject(e);
            });
        })
    }

    yield proxyWeb().timeout(10000).catch(Promise.TimeoutError, e=> {
        ctx.body = "接口已经超时"
    }).catch(e=> {
        ctx.body = e;
    })
})

