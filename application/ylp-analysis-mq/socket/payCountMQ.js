import Stomp from 'stompjs';

//console.log(G.mq, G.mq_pay_queue)
// 数据库
let model = D.model('analysis_pay')
if (G.mq && G.mq_pay_queue) {
    let client = Stomp.overTCP(G.mq.host, 61613)
    client.connect(G.mq.username, G.mq.password, async(d)=> {
        //console.log('model data',await model.find().limit(10).sort({id:'desc'}).toPromise())
        console.log(d)
        client.subscribe(G.mq_pay_queue, async(d)=> {
            //
            let data = JSON.parse(d.body)
            let checkCount = await model.count({bankOrderNo: data.bankOrderNo}).toPromise()
            //
            console.log('===' + G.mq_pay_queue + '===' + Date.now() + '====', data.bankOrderNo + '====mongoCount==' + checkCount);
            if (checkCount > 0) {
                await model.update({bankOrderNo: data.bankOrderNo}, data).toPromise()
            } else {
                await model.create(data).toPromise()
            }
        })
    }, (d)=> {
        return console.log(d)
    })
}
module.exports = async (io) => {

}