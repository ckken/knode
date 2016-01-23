export default class extends G.controller.rest {


    init(){
        super.init()
        this.modelName = 'activity_signin'
    }

    asyn

    async get(){
        var rs = await super.get({cb:true})
        //console.log(rs)
        /*_.forEach(rs.data.pageData,async(v,k)=>{

            rs.data.pageData[k].count = await D.model('activity_signin_member').count({aid:v.id}).toPromise()
            rs.data.pageData[k].online = await D.model('activity_signin_member').count({aid:v.id,online:1}).toPromise()
            console.log(rs.data.pageData[k])
        })*/

        /*await rs.data.pageData.forEach(async (v,k)=>{
            v.count = await D.model('activity_signin_member').count({aid:v.id}).toPromise()
            v.online = await D.model('activity_signin_member').count({aid:v.id,online:1}).toPromise()
        })*/

        for(let i=0;i<rs.data.pageData.length;i++){
            rs.data.pageData[i].count = await D.model('activity_signin_member').count({aid:rs.data.pageData[i].id}).toPromise()
            rs.data.pageData[i].online = await D.model('activity_signin_member').count({aid:rs.data.pageData[i].id,online:1}).toPromise()
        }



        this.json(rs)
    }



}