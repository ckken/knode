export default class extends G.controller.http {


    async shopinfo() {

        let d = await D.model('bsc_shopinfo').find().toPromise()
        for (var i = 0; i < d.length; i++) {
            await D.model('ls_shopinfo').create(d[i]).toPromise()
        }
        this.res.json({finish: true})
    }

    async custinfo() {
        let d = await D.model('bsc_custinfo').find().toPromise()
        for (var i = 0; i < d.length; i++) {
            await D.model('ls_custinfo').create(d[i]).toPromise()
        }
        this.res.json({finish: true})
    }

    async wareinfo() {
        /*let d = await D.model('bsc_analysisware').count().toPromise()
        return this.json({count:d})
        for (var i = 0; i < d.length; i++) {
            console.log(d[i])
            await D.model('ls_wareinfo').create(d[i]).toPromise()
        }*/

        await this.loopBack(252893,'bsc_analysisware','ls_wareinfo')

        this.res.json({finish: true})
    }

    /*async vipinfo() {

        //await D.model('ls_vipinfo').destroy().toPromise()
        //
        return this.json({})
        let count = 2990679
        let perCount = 10000
        let totalPage = Math.ceil(count/perCount)
        let startNum = 1

        let creatData = async function (page = 1) {
            let d = await D.model('bsc_analysisvip').find().paginate({limit: perCount, page: page}).toPromise()
            let count = 0
            if(d.length>0) {
                for (var i = 0; i < d.length; i++) {
                    console.log(d[i].Id)
                    count = await D.model('ls_vipinfo').count({Id:d[i].Id}).toPromise()||false
                    console.log(count)
                    if(!count){
                        console.log(d[i])
                        await D.model('ls_vipinfo').create(d[i]).toPromise()
                    }
                }
            }
        }

        let queen = async function(){
            let runSql = []

            for (var j = (startNum-1)*perCount; j < startNum*perCount; j++) {
                runSql.push(creatData(j))
            }
            await Promise.all(runSql)
            if(startNum*perCount<totalPage){
                startNum++
                console.log('queen',startNum)
                await queen()
            }
        }

        await queen()


        this.res.json({finish: true})
    }*/

    async loopBack(count,form,to){
        let perCount = 10000
        let totalPage = Math.ceil(count/perCount)
        let startNum = 17

        let creatData = async function (page = 1) {
            let runSql = []
            let d = await D.model(form).find().paginate({limit: perCount, page: page}).toPromise()
            let count = 0
            if(d.length>0) {
                for (var i = 0; i < d.length; i++) {
                    console.log(d[i].Id)
                    count = await D.model(to).count({Id:d[i].Id}).toPromise()||false
                    console.log(count)
                    if(!count){
                        console.log(d[i])
                        //await D.model(to).create(d[i]).toPromise()
                        runSql.push(D.model(to).create(d[i]).toPromise())
                    }
                }
                await Promise.all(runSql)
            }
        }

        let queen = async function(){
            /*let runSql = []

            for (var j = (startNum-1)*perCount; j < startNum*perCount; j++) {
                runSql.push(creatData(j))
            }
            await Promise.all(runSql)*/
            if(startNum<totalPage){

                await creatData(startNum)
                console.log('queen',startNum)
                startNum++
                await queen()
            }
        }

        await queen()


        //return this.res.json({finish: true})
    }




    /*    d.bsc_shopinfo = await D.model('bsc_shopinfo').count().toPromise()
     d.bsc_custinfo = await D.model('bsc_custinfo').count().toPromise()
     d.Bsc_AnalysisVip = await D.model('bsc_analysisvip').find().limit(1).toPromise()
     d.Bsc_AnalysisPos = await D.model('bsc_analysispos').find().limit(1).toPromise()
     d.Bsc_AnalysisWare = await D.model('bsc_analysisware').find().limit(1).toPromise()
     this.res.json(d)*/
}