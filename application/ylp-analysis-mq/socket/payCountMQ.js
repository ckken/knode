//import stompit from 'stompit';

console.log(G.mq, G.mq_pay_queue)

// 数据库
let model = D.model('analysis_pay')

if (G.mq && G.mq_pay_queue) {

    var Stomp = require('stompjs');
    var client = Stomp.overTCP(G.mq.host, 61613);
    client.connect(G.mq.username, G.mq.password, async(d)=>{
        //console.log(d)
        client.subscribe(G.mq_pay_queue, async(d)=>{
            //
            let data = JSON.parse(d.body)
            let checkCount = await model.count({bankOrderNo: data.bankOrderNo}).toPromise()
            //
            console.log('==='+G.mq_pay_queue+'===' + Date.now() + '====', data.bankOrderNo+'====mongoCount=='+checkCount);
            if (checkCount > 0) {
                await model.update({bankOrderNo: data.bankOrderNo}, data).toPromise()
            } else {
                await model.create(data).toPromise()
            }
        })
    }, (d)=>{
        return console.log(d)
    })

    /*
    let ylpServe = {
        'host': G.mq.host,
        'port': 61613,
        'connectHeaders': {
            'login': G.mq.username,
            'passcode': G.mq.password,
            'heart-beat': '5000,5000'
        }
    };

    let manager = new stompit.ConnectFailover([ylpServe], {
        'maxReconnects': 1000
    });
// 数据库
    let model = D.model('analysis_pay')
//MQ
    manager.connect(async(error, client, reconnect) => {

        if (error) {
            console.log('connect error ' + error.message);
            return;
        }

        let subscribeHeaders = {
            'destination': G.mq_pay_queue,
            'ack': 'auto'
        };

        client.subscribe(subscribeHeaders, async(error, message) => {
            if (error) {
                console.log('subscribe error ' + error.message);
                return;
            }
            message.readString('utf-8', async(error, body) => {
                if (error) {
                    console.log('read message error ' + error.message);
                    return;
                }
                //console.log(typeof body)
                let data = ('string' === typeof body) && JSON.parse(body) || body
                console.log('===test.payAnalysis.queue.data===' + Date.now() + '====', data.bankOrderNo);
                //=======================================
                //let data = ('string' === typeof body)&&JSON.parse(body)||body
                let checkCount = await model.count({bankOrderNo: data.bankOrderNo}).toPromise()
                //let check = await model.find({bankOrderNo:data.bankOrderNo}).toPromise()
                //console.log('checkCount',checkCount,check)
                if (checkCount > 0) {
                    await model.update({bankOrderNo: data.bankOrderNo}, data).toPromise()
                } else {
                    await model.create(data).toPromise()
                }

                //socket.emit('hasOrderUpdate',data)
                //=======================================
                message.ack();
            })
        })

        client.on('error', function (error) {
            reconnect();
        });

    });
//socket
*/


}


module.exports = async (io) => {


}