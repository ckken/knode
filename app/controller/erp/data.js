export default class extends G.controller.http{


    async shopinfo(){
        let d = await D.model('ls_shopinfo').find().toPromise()
        this.res.json(d)
    }

    async custinfo(){
        let d = await D.model('ls_custinfo').find().toPromise()
        this.res.json(d)
    }

    async vipinfo(){
        let d = await D.model('ls_vipinfo').find().limit(100).toPromise()
        this.res.json(d)
    }

}