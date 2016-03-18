import request from 'request';
export default class extends G.controller.rest {


    async __before(){
        let token = this.req.headers&&this.req.headers.token||false
        this.member = false


        if(token){
            this.member = await this.getData(G.web_b_host+'/accounts-center/check/token',token)
            if(!this.member||this.member.code !=0){
                return this.json(this.member)
            }
            this.member = this.member.data
        }else{
            return this.json({code:-2,msg:'缺少token'})
        }

        //权限设置
        this._map = this._map ||{}
        this._map.ylpEnterpriseAccountNo = this.member.ylpEnterpriseAccountNo
        this._map.userAccountNo = this.member.userAccountNo


        this.req.body = this.req.body ||{}
        this.req.body.ylpEnterpriseAccountNo = this.member.ylpEnterpriseAccountNo
        this.req.body.userAccountNo = this.member.userAccountNo

    }

    getData(url, token) {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                headers: {'token': token}
            }, (error, response, body)=> {
                if (!error && response.statusCode == 200) {
                    let d = JSON.parse(body&&body||{});
                    resolve(d)
                } else {
                    reject(error)
                }
            })
        })

    }

}