/**
 * Created by yuliang on 2016/12/6.
 */

const moment = require('moment')
const tokenService = require('../../middleware/service/oauth_service')
const coms = require('../../middleware/channel_com_center')

module.exports = {
    noAuths: [],
    getToken: function *() {
        var clientId = this.checkQuery("clientId").notEmpty().toInt().value;
        var userId = this.checkQuery("userId").notEmpty().toInt().value;
        var passWord = this.checkQuery("passWord").notEmpty().toInt().value;
        var publickKey = this.checkQuery("publickKey").notEmpty().value;
        this.errors && this.validateError()

        var clientInfo = yield tokenService.getClient(clientId)
        if (!clientInfo || clientInfo.status !== 0) {
            this.error('clientId错误或client status异常')
        }
        if (clientInfo.publicKey !== publickKey) {
            this.error('publickKey不匹配')
        }

        //此处验证userId和passWord
        var userToken = yield tokenService.getTokenByUserId(clientInfo.groupId, userId)
        if (userToken) {
            return yield tokenService.refreshToken(userToken).then(this.success)
        }

        yield tokenService.createToken(clientInfo, userId).then(this.success)
    },
    refreshToken: function *() {
        var clientId = this.checkQuery("clientId").notEmpty().value;
        var refreshToken = this.checkQuery("refreshToken").notEmpty().value;
        var publickKey = this.checkQuery("publickKey").notEmpty().value;
        var sign = this.checkQuery("sign").notEmpty().value;
        this.errors && this.validateError()

        yield coms.channelCom.hmac.main.call(this)

        if (this.oauth.clientInfo.publicKey !== publickKey) {
            this.error('publickKey不匹配')
        }

        var refreshTokenInfo = yield tokenService.getRefreshToken(refreshToken)
        if (!refreshTokenInfo || refreshTokenInfo.clientId != clientId) {
            this.error('未找到refreshToken,或者clientId不匹配')
        }
        if (refreshTokenInfo.refreshTokenExpireDate < moment().format("X")) {
            return this.success("refreshToken已过期")
        }

        yield tokenService.refreshToken(refreshTokenInfo).then(this.success)
    }
}