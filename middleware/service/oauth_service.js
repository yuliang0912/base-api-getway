/**
 * Created by yuliang on 2016/12/6.
 */

"use strict"

const moment = require('moment')
const apiUtils = require('../../libs/api_utils')
const getwayKnex = require('../../db_helper/knex').apiGetway

module.exports = {
    createToken: function (clientInfo, userId) {
        var token = {
            userId,
            status: 0,
            clientId: clientInfo.clientId,
            groupId: clientInfo.groupId,
            expireDate: moment().add(3, 'months').format("X"),
            refreshTokenExpireDate: moment().add(1, 'years').format("X"),
            accessToken: apiUtils.get64RandomStr().curString(40),
            refreshToken: apiUtils.get64RandomStr(),
            updateDate: moment().format("YYYY-MM-DD HH:mm:ss")
        }

        return getwayKnex("accessTokens").insert(token).then(()=>token)
    },
    refreshToken: function (refreshTokenInfo) {
        var oldAccessToken = refreshTokenInfo.accessToken

        refreshTokenInfo.accessToken = apiUtils.get64RandomStr().curString(40)
        refreshTokenInfo.expireDate = moment().add(3, 'months').format("X")
        refreshTokenInfo.refreshToken = apiUtils.get64RandomStr()
        refreshTokenInfo.refreshTokenExpireDate = moment().add(1, 'years').format("X")
        refreshTokenInfo.updateDate = moment().format("YYYY-MM-DD HH:mm:ss")

        return getwayKnex("accessTokens").update(refreshTokenInfo)
            .where({accessToken: oldAccessToken}).then(()=>refreshTokenInfo)
    },
    getToken: function (accessToken) {
        return getwayKnex("accessTokens").where({accessToken}).first()
    },
    getRefreshToken: function (refreshToken) {
        return getwayKnex("accessTokens").where({refreshToken}).first()
    },
    getTokenByUserId: function (groupId, userId) {
        return getwayKnex("accessTokens").where({groupId, userId, status: 0}).first()
    },
    getClient: function (clientId) {
        return getwayKnex("apps").where({clientId}).first()
    }
}