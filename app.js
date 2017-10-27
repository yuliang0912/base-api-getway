/**
 * Created by yuliang on 2016/12/1.
 */

"use strict"

const app = new (require('koa'))
const config = require('./configs/main')

//app.use(require('koa-static')(config.static.directory))

app.use(require('./middleware/selfonly/api_error')(app))
app.use(require('./middleware/selfonly/api_response')(app))
app.use(require('./middleware/selfonly/koa_bodyparse')(app))
require('koa-validate')(app)
require('./router/index')(app)

app.listen(config.port, () => {
    console.log('Server running on port:%s env:%s', config.port, process.env.NODE_ENV || 'development')
})