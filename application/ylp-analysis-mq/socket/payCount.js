module.exports = async (io) => {

    let model = D.model('analysis_pay')
    //链接支付
    let SC = io.of('/payCount');

    function setDay(day = 1) {
        let d = {
            now: {
                from: '',
                to: '',
                fromFormat: '',
                toFormat: '',
                diff: '',
                map: {}
            },
            ex: {
                from: '',
                to: '',
                format: '',
                diff: '',
                map: {}
            }
        }

        switch (day) {
            case 1:
                d.now.from = _.moment().subtract(0, "days").startOf("day")
                d.now.to = _.moment().subtract(0, "days").endOf("day")
                d.ex.from = _.moment().subtract(1, "days").startOf("day")
                d.ex.to = _.moment().subtract(1, "days").endOf("day")
                break;
            case -1:
                d.now.from = _.moment().subtract(1, "days").startOf("day")
                d.now.to = _.moment().subtract(1, "days").endOf("day")
                d.ex.from = _.moment().subtract(2, "days").startOf("day")
                d.ex.to = _.moment().subtract(2, "days").endOf("day")
                break;
            case -2:
                d.now.from = _.moment().subtract(2, "days").startOf("day")
                d.now.to = _.moment().subtract(2, "days").endOf("day")
                d.ex.from = _.moment().subtract(3, "days").startOf("day")
                d.ex.to = _.moment().subtract(3, "days").endOf("day")
                break;
            case 7:
                d.now.from = _.moment().startOf("weeks")
                d.now.to = _.moment().endOf("weeks")
                d.ex.from = _.moment().subtract(1, "weeks").startOf("weeks")
                d.ex.to = _.moment().subtract(1, "weeks").endOf("weeks")
                break;
            case 30:
                d.now.from = _.moment().startOf("months")
                d.now.to = _.moment().endOf("months")
                d.ex.from = _.moment().subtract(1, "months").startOf("months")
                d.ex.to = _.moment().subtract(1, "months").endOf("months")
                break;
        }

        d.now.fromFormat = d.now.from.format('YYYY-MM-DD HH:mm:ss')
        d.now.toFormat = d.now.to.format('YYYY-MM-DD HH:mm:ss')
        d.now.diff = d.now.to.diff(d.now.from, 'days') + 1
        d.now.map.completeTime = {'>=': new Date(d.now.fromFormat), '<=': new Date(d.now.toFormat)};
        /////////////////////////////////////////////////////////////
        d.ex.fromFormat = d.ex.from.format('YYYY-MM-DD HH:mm:ss')
        d.ex.toFormat = d.ex.to.format('YYYY-MM-DD HH:mm:ss')
        d.ex.diff = d.ex.to.diff(d.ex.from, 'days') + 1
        d.ex.map.completeTime = {'>=': new Date(d.ex.fromFormat), '<=': new Date(d.ex.toFormat)};

        return d
    }


    async function getData(day = 1) {
        let d = setDay(day)
        let data = {
            totalAmount: 0,
            totalOrder: 0,
            avgAmount: 0,
            avgTotalAmount: 0,
            avgTotalOrder: 0,
            activeProvider: 0,
            activeStore: 0,
            plat: 0,
            addTotalAmount: 0,
            addTotalOrder: 0,
            addAvgAmount: 0,
            addAvgTotalAmount: 0,
            addAvgTotalOrder: 0,
            addActiveProvider: 0,
            addActiveStore: 0,
            addPlat: 0
        }
        //
        data.totalAmount = await model.find(d.now.map).sum('orderAmount').toPromise() || []
        data.totalAmount = data.totalAmount[0] && data.totalAmount[0].orderAmount || 0
        //
        data.totalOrder = await model.count(d.now.map).toPromise() || 0
        data.avgAmount = data.totalAmount / data.totalOrder || 0
        data.avgTotalAmount = (data.totalAmount / d.now.diff||0).toFixed(2)
        data.avgTotalOrder = (data.totalOrder / d.now.diff||0).toFixed(2)
        //
        data.activeProvider = await model.find({
            where: d.now.map,
            groupBy: ['providerId'],
            sum: ['provider']
        }).toPromise()
        data.activeProvider = data.activeProvider.length
        //
        data.activeStore = await model.find({where: d.now.map, groupBy: ['storeId'], sum: ['store']}).toPromise()
        data.activeStore = data.activeStore.length
        //
        d.now.map.fundIntoType = 'PLAT_FORM'
        data.plat = await model.count(d.now.map).toPromise() || 0
        data.plat = parseInt(data.plat / data.totalOrder * 100 || 0) + '%'
        ////////////////////////////////////////////////////////////////////
        data.addTotalAmount = await model.find(d.ex.map).sum('orderAmount').toPromise() || []
        data.addTotalAmount = data.addTotalAmount[0] && data.addTotalAmount[0].orderAmount || 0
        //
        data.addTotalOrder = await model.count(d.ex.map).toPromise() || 0
        data.addAvgAmount = data.addTotalAmount / data.addTotalOrder || 0
        data.addAvgTotalAmount = (data.addTotalAmount / d.ex.diff||0).toFixed(2)
        data.addAvgTotalOrder = (data.addTotalOrder / d.ex.diff||0).toFixed(2)
        //
        data.addActiveProvider = await model.find({
            where: d.ex.map,
            groupBy: ['providerId'],
            sum: ['provider']
        }).toPromise()
        data.addActiveProvider = data.addActiveProvider.length
        //
        data.addActiveStore = await model.find({where: d.ex.map, groupBy: ['storeId'], sum: ['store']}).toPromise()
        data.addActiveStore = data.addActiveStore.length
        //
        d.ex.map.fundIntoType = 'PLAT_FORM'
        data.addPlat = await model.count(d.ex.map).toPromise() || 0
        data.addPlat = parseInt(data.plat / data.addTotalOrder * 100 || 0) + '%'
        return data
    }

    let cache = {}
    cache[1] = await getData()

    SC.on('connection', async (socket)=> {


        socket.day = socket.day||1
        cache[socket.day] = cache[socket.day] || await getData(day)||{}
        socket.emit('payCount', cache[socket.day])
        socket.emit('updateTime', Date.now())
        socket.emit('online', 0)


        socket.on('day', async  (day)=> {
            socket.day = day
            cache[socket.day] = cache[socket.day] || await getData(day)||{}
            socket.emit('payCount', cache[day])
            socket.emit('updateTime', Date.now())
        })

        socket.on('hasOrderUpdate',async(d) =>{
            cache = {}
        })


        socket.on('disconnect', async  ()=> {
            socket.emit('online', 0)
        })

    })
}