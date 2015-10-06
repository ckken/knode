import WechatAPI from 'wechat-api'
import fs from 'fs'

export default class {

    async init(sid, wx) {
        this.sid = sid || (wx && wx.sid) || false
        if (!sid)return this.error('sid不能为空')

        //获取微信数据
        if (!wx) {
            wx = await D.model('wx_account').findOne({sid: sid}).toPromise()
            if (!wx)return this.error('不存在该公众号')
        }
        this.wx = wx
        //临时目录
        let weixinTmp = G.path.tmp + '/weixin'
        if (!fs.existsSync(weixinTmp))fs.mkdirSync(weixinTmp)
        let tmp = weixinTmp + '/' + sid + '_api_token.txt';
        this.api = new WechatAPI(wx.appid, wx.secret, function (callback) {
            if (fs.existsSync(tmp)) {
                fs.readFile(tmp, 'utf8', function (err, txt) {
                    if (err) {
                        return callback(err);
                    }
                    txt = txt && JSON.parse(txt) || {}
                    callback(null, txt);
                })
            } else {
                callback(null, {})
            }
        }, function (token, callback) {
            fs.writeFile(tmp, JSON.stringify(token), callback);
        });


        this.api.registerTicketHandle((type, callback)=> {
            if (fs.existsSync(this.type_path(type, sid))) {
                fs.readFile(this.type_path(type, sid), 'utf8', function (err, txt) {
                    if (err) {
                        return callback(err);
                    }
                    txt = txt && JSON.parse(txt) || {}
                    callback(null, txt);
                })
            } else {
                callback(null, {})
            }
        }, (type, _ticketToken, callback)=> {
            fs.writeFile(this.type_path(type, sid), JSON.stringify(_ticketToken), callback);
        });
    }

    error(msg) {
        return {error: msg}
    }

    //生成缓存动态路径
    type_path(type, sid) {
        return G.path.tmp + '/weixin/' + sid + '_' + type + '_api_ticket.txt'
    }

    //获取jsSDK
    getJsConfig(param) {
        return new Promise((resolve, reject)=> {
            this.api.getJsConfig(param, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    //创建带参数二维码
    createLimitQRCode(code) {
        return new Promise((resolve, reject)=> {
            this.api.createLimitQRCode(code, (err, data)=> {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    //获取服务器ip
    getIpByApi() {
        return new Promise((resolve, reject)=> {
            this.api.getIp(function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    //发送模板消息
    sendTemplateByApi(conf) {
        return new Promise((resolve, reject)=> {
            this.api.sendTemplate(conf.openid, conf.templateId, conf.url, conf.topColor, conf.data, (err, data)=> {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    //根据OPENID 获取关注的用户信息
    getUserByApi(opt) {
        return new Promise((resolve, reject)=> {
            this.api.getUser(opt, (err, data)=> {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    //开始时间 jssdk辅助函数
    createTimeStamp() {
        return parseInt(new Date().getTime() / 1000) + '';
    }
}