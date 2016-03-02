import base from '../common/base.js'
export default class extends base {


    init(){
        super.init()
        this.modelName = 'activity_signin'

    }


    async get(){



        var rs = await super.get({cb:true})

        for(let i=0;i<rs.data.pageData.length;i++){
            rs.data.pageData[i].count = await D.model('activity_signin_member').count({aid:rs.data.pageData[i].id}).toPromise()
            rs.data.pageData[i].online = await D.model('activity_signin_member').count({aid:rs.data.pageData[i].id,online:1}).toPromise()
        }
        this.json(rs)
    }

    async members(){
        let rs = {}
        delete this._map.ylpEnterpriseAccountNo
        delete this._map.userAccountNo
        this._map.aid = this.req.params.id
        console.log(this.req.params)
        this._map.nickname = this.req.params.nickname
        if(this._map.aid){
            console.log("aid:",this._map.aid)
            this.modelName = 'activity_signin_member'
            rs = await super.get({cb:true})
        }
        if(this._map.nickname){
            console.log("nickname:",this._map.nickname)
            this.modelName = 'activity_signin_member'
            rs = await super.get({cb:true})
        }
        this.json(rs)
    }



}