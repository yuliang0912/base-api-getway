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
            console.log(self.req.set("host", "127.0.0.1"))
            proxy.web(self.req, self.res, {
                target: self.authorize.proxyUrl
            }, function (e) {
                console.log(3243242)
                reject(e);
            });

            proxy.on('proxyRes', function (proxyRes, req, res, options) {
                console.log(11111111)
                resolve(res);
            });

            proxy.on('error', function (e) {
                console.log(e)
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

