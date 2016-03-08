import Stomp from 'stompjs';
import ioe from 'socket.io-emitter';
let emitter = ioe({ host: G.redis.host, port: G.redis.port })

/*emitter.of('/payCount').emit('updateFromMq', true);
//测试客户端的内容
setTimeout(function(){
    emitter.of('/payCount').emit('updateFromMq', true);
}, 10000);*/

// 数据库
let model = D.model('analysis_pay')
if (G.mq && G.mq_pay_queue) {
    let client = Stomp.overTCP(G.mq.host, 61613)
    client.connect(G.mq.username, G.mq.password, async(d)=> {
        //console.log('model data',await model.find().limit(10).sort({id:'desc'}).toPromise())
        client.subscribe(G.mq_pay_queue, async(d)=> {
            //
            console.log(d.body)
            let data = d&&JSON.parse(d.body)
            let checkCount = await model.count({bankOrderNo: data.bankOrderNo}).toPromise()
            //
            console.log('===' + G.mq_pay_queue + '===' + Date.now() + '====', data.bankOrderNo + '====mongoCount==' + checkCount);
            if (checkCount > 0) {
                await model.update({bankOrderNo: data.bankOrderNo}, data).toPromise()
            } else {
                await model.create(data).toPromise()
            }
            //通知客户端已经发布了
            emitter.of('/payCount').emit('updateFromMq', true);
        })
    }, (d)=> {
        return console.log(d)
    })
}
module.exports = async (io) => {

}