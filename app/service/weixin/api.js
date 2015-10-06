import api_base from './api_base'

var expireTime = 7200 - 100// 2小时后过期，需要重新获取数据后计算签名
    , cachedSignatures = {} //缓存在服务器的每个URL对应的数字签名对象

export default class extends api_base {
    async jssdk(opt = {}) {
        var _debug = opt.debug && true || false;
        var _url = opt.query || '';
        if (!_url) return this.error('url 不能为空')
        if (!cachedSignatures[_url + this.sid] || this.createTimeStamp() - cachedSignatures[_url + this.sid].timestamp > expireTime) {
            var param = {
                debug: _debug,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ],
                url: _url
            };
            let data = await this.getJsConfig(param)

            cachedSignatures[_url + this.sid] = data
            cachedSignatures[_url + this.sid].timestamp = this.createTimeStamp()

        }

        return cachedSignatures[_url + this.sid]

    }

    async getIp(opt = {}) {
        return await this.getIpByApi()
    }

    async qrcode(opt = {}) {
        let code = opt.query
        let cb = this.error('code 参数不能为空')
        if (code) {
            let json = await this.createLimitQRCode(code)
            cb = this.api.showQRCodeURL(json.ticket)
        }
        return cb
    }

    async sendTemplate(opt = {}) {
        let conf = opt.query
        return await this.sendTemplateByApi(conf)

    }

    async getUser(opt = {}) {
        let openid = opt.query
        let opt_default = {
            openid: openid,
            lang: 'zh_CN'
        }
        _.extend(opt_default, opt)
        delete opt_default.query
        if (openid) {
            return await this.getUserByApi(opt_default)
        } else {
            return this.error('openid 不能为空')
        }
    }
}