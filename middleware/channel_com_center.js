/**
 * Created by yuliang on 2016/12/7.
 */

"use strict"

var channelCom = {}
const channelComMapping = {
    oauth: "oauth2.0",
    basice: "basice_auth",
    logs: "logs",
    hmacSign: "hmac",
    whiteList: "white_list",
    blackList: "black_list",
}

var channelComKeys = Object.keys(channelComMapping)

Object.keys(channelComMapping).forEach(item=> {
    channelCom[item] = require('./channel/' + channelComMapping[item])
})

module.exports.channelCom = channelCom
module.exports.channelComKeys = channelComKeys

// module.exports.authorize = {
//     basice64: require('./authorize/basice64_authorize'),
//     client: require('./authorize/client_authorize'),
//     hmac: require('./authorize/hmac_sign_authorize'),
//     token: require('./authorize/token_authorize'),
//     passWord: require('./authorize/user_password_authorize'),
// }
