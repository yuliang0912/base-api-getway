/**
 * Created by yuliang on 2016/12/1.
 */

const app = new (require('koa'))
const config = require('./configs/main')
const log = require('./libs/log4').koa

//app.use(require('koa-static')(config.static.directory))

app.use(require('./middleware/selfonly/api_response')(app))
app.use(require('./middleware/selfonly/koa_bodyparse')())
require('koa-validate')(app)
require('./router/index')(app)

app.listen(config.port, ()=> {
    console.log('Server running on port:' + config.port)
})

app.on('error', err=> {
    log.error("app_on_error:" + err.toString())
})

process.on('unhandledRejection', function (err) {
    log.warn("unhandledRejectionLogs:" + err.stack)
})