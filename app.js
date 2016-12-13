/**
 * Created by yuliang on 2016/12/1.
 */

const app = new (require('koa'))
const config = require('./configs/main')
const bodyparser = require('koa-bodyparser');

//const favicon = require('koa-favicon');
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(bodyparser())
app.use(require('./middleware/selfonly/api_response')(app))
require('koa-validate')(app)
require('./router/auto-router')(app)


app.listen(config.port, ()=> {
    console.log('Server running on port:' + config.port)
})

app.on('error', err=> {
    console.log('server error', err);
})


