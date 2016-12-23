/**
 * Created by yuliang on 2016/12/1.
 */

const co = require('co')
const httpProxy = require('http-proxy')
const Promise = require('bluebird')
const proxy = httpProxy.createProxyServer({auth: "572219626:1"});

module.exports = co.wrap(function *() {
    var self = this;

    function proxyWeb() {
        return new Promise(function (resolve, reject) {
            proxy.web(self.req, self.res, {
                target: self.authorize.proxyUrl
            }, function (e) {
                reject(e);
            });

            proxy.on('response', function (proxyRes, req, res, options) {
                console.log(11)
                resolve(res);
            });

            proxy.on('error', function (e) {
                reject(e);
            });
        })
    }

    yield proxyWeb().timeout(10000).catch(Promise.TimeoutError, e=> {
        this.body = "接口已经超时"
    }).catch(e=> {
        this.body = e;
    })
})

