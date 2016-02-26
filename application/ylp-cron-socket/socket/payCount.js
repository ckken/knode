import fn from '../service/getToken'
import qs from 'querystring'//qs.stringify({oauth_token: req_data.oauth_token})


let payHost = 'http://pay-api.yolipai.com/trade/countTrade?'//http://pay-api.yolipai.com/trade/countTrade?beginTime=2016-02-01+00%3A00%3A00&endTime=2016-02-29+23%3A59%3A59&status=SUCCESS&page=1&pageSize=100

let pFn = new fn()
let params = {
    beginTime:_.moment().subtract(0, "days").startOf("day").format('YYYY-MM-DD HH:mm:ss'),
    endTime:_.moment().subtract(0, "days").endOf("day").format('YYYY-MM-DD HH:mm:ss'),
    status:'SUCCESS',
    page:1,
    pageSize:100
}

module.exports = async (io) => {

    async function getPay(ps){
        ps = ps||params
        let host= payHost+qs.stringify(ps)
        return await pFn.on(async()=>{
            return await pFn.getData(host)
        })
    }

    //链接支付
    let SC = io.of('/payCount');
    let online = 0
    SC.on('connection', async (socket)=> {

        online ++;

        socket.params = params
        socket.data = await getPay(socket.params)
        socket.emit('payCount', socket.data)
        socket.emit('updateTime',Date.now())

        socket.emit('online',online)


        socket.on('day', async  (day)=> {
            switch (day){
                case 1:
                    socket.params.beginTime=_.moment().subtract(0, "days").startOf("day").format('YYYY-MM-DD HH:mm:ss');
                    socket.params.endTime=_.moment().subtract(0, "days").endOf("day").format('YYYY-MM-DD HH:mm:ss');
                    break;
                case -1:
                    socket.params.beginTime=_.moment().subtract(-1, "days").startOf("day").format('YYYY-MM-DD HH:mm:ss');
                    socket.params.endTime=_.moment().subtract(-1, "days").endOf("day").format('YYYY-MM-DD HH:mm:ss');
                    break;
                case -2:
                    socket.params.beginTime=_.moment().subtract(-2, "days").startOf("day").format('YYYY-MM-DD HH:mm:ss');
                    socket.params.endTime=_.moment().subtract(-2, "days").endOf("day").format('YYYY-MM-DD HH:mm:ss');
                    break;
                case 7:
                    socket.params.beginTime=_.moment().startOf("weeks").format('YYYY-MM-DD HH:mm:ss');
                    socket.params.endTime=_.moment().endOf("weeks").format('YYYY-MM-DD HH:mm:ss');
                    break;
                case 30:
                    socket.params.beginTime=_.moment().startOf("months").format('YYYY-MM-DD HH:mm:ss');
                    socket.params.endTime=_.moment().endOf("months").format('YYYY-MM-DD HH:mm:ss');
                    break;
            }

            socket.data = await getPay(socket.params)
            socket.emit('payCount',socket.data)
            socket.emit('updateTime',Date.now())

        })

        socket.cron_run = setInterval(async ()=>{
            socket.data = await getPay(socket.params)
            socket.emit('payCount',socket.data)
            socket.emit('updateTime',Date.now())
        },20000);
        socket.on('disconnect', async  ()=> {
            online--
            socket.emit('online',online)
            clearInterval('socket.cron_run');
        })

    })
}