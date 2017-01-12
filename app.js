/**
 * Created by yuliang on 2016/12/1.
 */

const app = new (require('koa'))
const config = require('./configs/main')
const log = require('./libs/log4').koa
const cluster = require('cluster')

//app.use(require('koa-static')(config.static.directory))

app.use(require('./middleware/selfonly/api_error')(app))
app.use(require('./middleware/selfonly/api_response')(app))
app.use(require('./middleware/selfonly/koa_bodyparse')(app))
require('koa-validate')(app)
require('./router/index')(app)

app.listen(config.port, ()=> {
    console.log('Server running on port:%s,isMaster:', config.port, cluster.isMaster)
})

app.on('error', (err, ctx)=> {
    log.fatal(err.toString())
})

process.on('unhandledRejection', function (err) {
    log.warn("unhandledRejectionLogs:" + err.stack)
})

process.on('SIGINT', function (err) {
    log.fatal("pm2-error" + err.toString())
});

//
// Buffer.prototype.toByteArray = function () {
//     return Array.prototype.slice.call(this, 0)
// }

