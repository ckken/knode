// MQ

import stompit from 'stompit';

let ylpServe = {
    'host': G.mq.host,
    'connectHeaders':{
        'login': G.mq.username,
        'passcode': G.mq.password,
        //'heart-beat': '5000,5000'
    }
};

let manager = new stompit.ConnectFailover([ylpServe], {
    'maxReconnects': 1000
});
// 数据库
let model = D.model('analysis_pay')
//MQ
manager.connect(async(error, client, reconnect) =>{

    if (error) {
        console.log('connect error ' + error.message);
        return;
    }

    let subscribeHeaders = {
        'destination': G.mq_pay_queue,
        'ack': 'auto'
    };


    if(G.mq_pay_queue) {
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
    }
});
//socket

/*let io = require('socket.io-client')

var socket = io.connect('http://127.0.0.1:8804/payCount',{forceNew: true})
socket.on('connect',function(d){
    console.log('connect',socket.id)
    //console.log(socket)
    socket.emit('hasOrderUpdate','hasOrderUpdate')
})
socket.on('payCount',function(d){
    console.log(d)

})*/


module.exports = async (io) => {


}