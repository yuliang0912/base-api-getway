/**
 * Created by yuliang on 2016/12/6.
 */

"use strict"

const co = require('co')

module.exports.main = co.wrap(function *() {
    return 3;
});

// /epaper/v1/              /epaper/v3/          95% oauth
// /test/epaper/v1/         /epaper/v3/          95% oauth
// /preview/epaper/v1/      /epaper/v3/          95% oauth
//
// /epaper/v1/getWork  /epaper/v3/getWork   5%  basic
// /epaper/v1/getWork  /epaper/v3/getWork   5%  pass


//v1-epaper
//v1-epaper-work
//v1-epaper-work-getwork



