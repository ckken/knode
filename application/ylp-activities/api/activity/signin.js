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
        if(this._map.aid){
            this.modelName = 'activity_signin_member'
            rs = await super.get({cb:true})
        }
        if(this.req.query.nickname){
            this.modelName = 'activity_signin_member'
            rs = await super.get({cb:true})
        }
        this.json(rs)
    }



}