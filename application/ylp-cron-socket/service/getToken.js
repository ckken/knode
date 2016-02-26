import request from 'request'
import querystring from 'querystring' // qs.parse(body) postData qs.stringify({oauth_token: req_data.oauth_token}) getData
//let getAsync = Promise.promisify(request.get)

let username = 'ylpsj'
let password = 'YUNying20160215'
let host = 'http://m.yolipai.com'
let loginUrl = host+'/accounts/oauth/login'

export default class {

    constructor(){
        this.token = ''
        this.refreshToken = ''
    }

    //获取数据
    getData(url,method='GET',data={}) {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                headers: {'token': this.token},
                method:method,
            }, (error, response, body)=> {
                if (!error && response.statusCode == 200) {
                    let d = JSON.parse(body);
                    resolve(d)
                } else {
                    reject(error)
                }
            })
        })
    }

    //登录
    async loginIn(){
        return new Promise((resolve,reject)=> {
            request.post({url: loginUrl, form: {userName: username, passWord: password}}, (error, response, body)=> {
                if (!error && response.statusCode == 200) {
                    let d = JSON.parse(body);
                    if(d.code===0){
                        this.token = d.data.token
                        this.refreshToken = d.data.refreshToken
                    }
                    resolve(d)
                } else {
                    reject(error)
                }
            })
        })
    }

    //token 事务操作
    async on(asyncFn){
        let d = await asyncFn()
        if(d.code!==0){
            await this.loginIn()
            d = await asyncFn()
        }
        return d.data
    }

}
