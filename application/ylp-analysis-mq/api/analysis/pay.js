export default class extends G.controller.rest {


    init(){
        this.modelName = 'analysis_pay';
    }
    /*原始数据字段：
     订单总额："totalAmount"
     订单总数："totalOrder"
     客单价:"avgAmount"
     日均交易额："avgTotalAmount"
     日均单数："avgTotalOrder"
     活跃商家： "activeProvider"
     活跃门店："activeStore"
     有礼派收款占比："plat"
     /////////////////////////////
     环比数据字段：
     订单总额： "addTotalAmount"
     订单总数： "addTotalOrder"
     客单价:"addAvgAmount"
     日均交易额："addAvgTotalAmount"
     日均单数： "addAvgTotalOrder"
     活跃商家："addActiveProvider"
     活跃门店："addActiveStore"
     有礼派收款占比： "addPlat"*/

    setDay(day){
        let params = {}
        switch (day){
            case 1:
                params.beginTime=_.moment().subtract(0, "days").startOf("day").format('YYYY-MM-DD HH:mm:ss');
                params.endTime=_.moment().subtract(0, "days").endOf("day").format('YYYY-MM-DD HH:mm:ss');
                break;
            case -1:
                params.beginTime=_.moment().subtract(1, "days").startOf("day").format('YYYY-MM-DD HH:mm:ss');
                params.endTime=_.moment().subtract(1, "days").endOf("day").format('YYYY-MM-DD HH:mm:ss');
                break;
            case -2:
                params.beginTime=_.moment().subtract(2, "days").startOf("day").format('YYYY-MM-DD HH:mm:ss');
                params.endTime=_.moment().subtract(2, "days").endOf("day").format('YYYY-MM-DD HH:mm:ss');
                break;
            case 7:
                params.beginTime=_.moment().startOf("weeks").format('YYYY-MM-DD HH:mm:ss');
                params.endTime=_.moment().endOf("weeks").format('YYYY-MM-DD HH:mm:ss');
                break;
            case 30:
                params.beginTime=_.moment().startOf("months").format('YYYY-MM-DD HH:mm:ss');
                params.endTime=_.moment().endOf("months").format('YYYY-MM-DD HH:mm:ss');
                break;
            case 360:
                params.beginTime=_.moment().startOf("years").format('YYYY-MM-DD HH:mm:ss');
                params.endTime=_.moment().endOf("years").format('YYYY-MM-DD HH:mm:ss');
                break;

        }
        return params
    }

    async get(){
        let map = {}
        let data = {
            totalAmount:0,
            totalOrder:0,
            avgAmount:0,
            avgTotalAmount:0,
            avgTotalOrder:0,
            activeProvider:0,
            activeStore:0,
            plat:0,
            addTotalAmount:0,
            addTotalOrder:0,
            addAvgAmount:0,
            addAvgTotalAmount:0,
            addAvgTotalOrder:0,
            addActiveProvider:0,
            addActiveStore:0,
            addPlat:0
        }
        /////////////////////////////
        map = this.setDay(360)
        console.log(map)
        //let count = await D.model('analysis_pay').count(map).toPromise()
        let d = await D.model('analysis_pay').find().sort({id:'desc'}).limit(409).toPromise()||[]
        /*for(var i=0;i<d.length;i++){
            await D.model('analysis_pay').update({id:d[i].id},{
                "paySuccessTime":d[i].paySuccessTime,
                "completeTime":d[i].completeTime,
                "createTime":d[i].createTime,
                "modifyTime":d[i].modifyTime
            }).toPromise()
        }*/
        this.json(d)
    }

}