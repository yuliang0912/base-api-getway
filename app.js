/**
 * Created by yuliang on 2016/12/1.
 */

const app = new (require('koa'))
const config = require('./configs/main')

//const favicon = require('koa-favicon');
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(require('./middleware/selfonly/api_response')(app))
require('koa-validate')(app)
require('./router/auto-router')(app)

//app.use(require('./http-proxy/http-proxy'));
//app.use(require('./http-proxy/fetch-proxy'))

app.listen(config.port, ()=> {
    console.log('Server running on port:' + config.port)
})

app.on('error', err=> {
    console.log('server error', err);
})




