/**
 * Created by yuliang on 2016/12/12.
 */

"use strict"

const Events = require('events');


module.exports = function () {
    Events.EventEmitter.call(this);
}
