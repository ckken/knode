export default class extends G.controller.http{

    async index(){
        this.display()
    }

    async sqs(){
        let d = {}
        //d.bsc_shopinfo = await D.model('bsc_shopinfo').count().toPromise()
        //d.bsc_custinfo = await D.model('bsc_custinfo').count().toPromise()
        //d.Bsc_AnalysisVip = await D.model('bsc_analysisvip').find().limit(1).toPromise()
        d.Bsc_AnalysisPos = await D.model('bsc_analysispos').find().limit(1).toPromise()
        d.Bsc_AnalysisWare = await D.model('bsc_analysisware').find().limit(1).toPromise()
        this.res.json(d)
    }

/*    async shopinfo(){
        let d = {}
        d = await D.model('ls_shopinfo').find().toPromise()
        this.res.json(d)
    }*/



}