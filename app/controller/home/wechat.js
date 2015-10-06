/**
 * Created by ken on 15/10/7.
 */

export default class extends G.controller.http {

    async __before() {
        //初始化微信api 接口
        this.srv = G.service.load('weixin/api')
        this.srv = new this.srv()
        await this.srv.init(2, null)
        this.data = {}
    }

    async getIp() {
        this.data = await this.srv.getIp()
    }

    async jssdk() {
        this.data = await this.srv.jssdk({
            query: 'http://baidu.com'
        })
    }

    async qrcode() {
        this.data = await this.srv.qrcode({
            query: 'http://baidu.com'
        })
    }

    async getUser() {
        this.data = await this.srv.getUser({
            query: 'o571buG8MH8FhjMwBKgvOcEAVcZE'
        })
    }

    async send() {
        this.data = await this.srv.sendTemplate({
            query: {
                openid: 'oSD_Nw52qcTFg7fRXYt_cB3AALxY',
                templateId: 'idT15W4pJLnxJc2AWE6furRA-lN0i5hs_BmJDotsS60',
                url: 'http://wvovo.com',
                topColor: '#ce064c',
                data: {
                    first: {
                        "value": "邀请成功"
                    },
                    keyword1: {
                        "value": 'Ken'
                    },
                    keyword2: {
                        "value": _.moment().format('LLL')
                    },
                    remark: {
                        "value": '您的好友Ken已经接受邀请，请再接再厉'
                    }

                }
            }
        })

    }

    async __after() {
        this.res.json(this.data)
    }


}