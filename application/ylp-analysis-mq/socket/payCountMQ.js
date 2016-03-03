//let stompit = require('stompit');
import stompit from 'stompit';
let ylpServe = {
    'host': '172.16.8.121',
    'connectHeaders':{
        'login': 'ylp',
        'passcode': 'ylp.123',
        //'heart-beat': '5000,5000'
    }
};

let manager = new stompit.ConnectFailover([ylpServe], {
    'maxReconnects': 10
});

let model = D.model('analysis_pay')

manager.connect(async(error, client, reconnect) =>{

    if (error) {
        console.log('connect error ' + error.message);
        return;
    }

    let subscribeHeaders = {
        'destination': 'test.payAnalysis.queue.data',
        'ack': 'auto'
    };

    client.subscribe(subscribeHeaders, async(error, message) =>{
        if (error) {
            console.log('subscribe error ' + error.message);
            return;
        }
        message.readString('utf-8', async(error, body) =>{
            if (error) {
                console.log('read message error ' + error.message);
                return;
            }
            //console.log(typeof body)
            let data = ('string' === typeof body)&&JSON.parse(body)||body
            console.log('===test.payAnalysis.queue.data==='+Date.now()+'====',data.bankOrderNo);
            //=======================================
            //let data = ('string' === typeof body)&&JSON.parse(body)||body
            let checkCount = await model.count({bankOrderNo:data.bankOrderNo}).toPromise()
            //let check = await model.find({bankOrderNo:data.bankOrderNo}).toPromise()
            //console.log('checkCount',checkCount,check)
            if(checkCount>0){
                await model.update({bankOrderNo:data.bankOrderNo},data).toPromise()
            }else{
                await model.create(data).toPromise()
            }
            //=======================================
            message.ack();
        })
    })

    client.on('error', function(error) {
        reconnect();
    });
});

module.exports = async (io) => {



}