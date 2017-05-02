/**
 * Created by yuliang on 2016/6/11.
 */

"use strict"

const retCodeEnum = {
    //服务器维护中
    "serverMaintain": -10,
    //正常结果
    "success": 0,
    //程序内部错误
    "serverError": 1,
    //未授权的请求
    "authenticationFailure": 2,
    //token认证相关错误
    "oauthError": 3,
    //刷新token相关错误
    "refreshTokenError": 4,
    //代理相关错误
    "agentError": 5,
};

const errCodeEnum = {
    //正常结果
    "success": 0,
    //自动捕捉的错误
    "autoSnapError": 1,
    //接口拒绝请求的错误,一般指method不正确或者未授权
    "refusedRequest": 2,
    //未找到指定的控制器
    "notFoundController": 11,
    //未找到指定的接口版本
    "notFoundApiVersion": 12,
    //未找到指定的接口,即action不存在
    "notFoundApiAction": 13,
    //接口未返回数据
    "notReturnData": 14,
    //参数类型错误
    "paramTypeError": 15,
    //oauth_client相关错误
    "clientError": 16,
    //oauth_accesstoken相关错误
    "accessTokenError": 17,
    //oauth_refreshtoken相关错误
    "refreshTokenError": 18,
    //hmac签名验证相关错误
    "hmacsha1SignError": 19,
    //basice认证相关错误
    "basiceAuthError": 20,
    //用户密码验证相关错误
    "passWordError": 21,
    //未找到代理代理服务器错误
    "notFoundAgentServerError": 22,
    //请求超时错误
    "requestTimeoutError": 23,
    //黑名单,禁止访问
    "blackListError": 24,
    //白名单,没有权限
    "whiteListError": 25,
    //源服务器请求异常
    "originalServerError": 26,
    //token过期
    "accessTokenTimeOutError": 27,
    //token认证中手机号码验证错误
    "accessTokenMobileError": 28,
    //用户ID或密码验证错误
    "userIdOrPwdError": 29,
    //客户端授权模式错误
    "clientCredentialsError": 30,
    //程序其他异常
    "apiError": 100
};

module.exports = {
    retCodeEnum, errCodeEnum
};