
 brokerURL=failover\:(tcp\://172.16.8.121\:61616)?randomize\=false&initialReconnectDelay\=1000&maxReconnectDelay\=30000
 userName=ylp
 password=ylp.123
 maxConnections=20
 queueName=test.payAnalysis.queue.data



//var client = new Stomp('172.16.8.121', 61616, 'ylp', 'ylp.123');
var connectOptions = {
    'host': '172.16.8.121',
    'port': 61613,
    //'timeout':10,
    'maxReconnects':10,
    'connectHeaders':{
        //'host': '/',
        'login': 'ylp',
        'passcode': 'ylp.123',
        'heart-beat': '5000,5000'
    }
};

stompit.connect(connectOptions, function(error, client) {
    //console.log(error, client)

    if (error) {
        console.log('connect error ' + error.message);
        return;
    }

    //var sendHeaders = {
    //    'destination': '/queue/test.payAnalysis.queue.data',
    //    'content-type': 'text/plain'
    //};
    //
    //var frame = client.send(sendHeaders);
    //frame.write('hello');
    //frame.end();

    var subscribeHeaders = {
        'destination': 'test.payAnalysis.queue.data',
        'ack': 'auto'
    };

    client.subscribe(subscribeHeaders, function(error, message) {

        if (error) {
            console.log('subscribe error ' + error.message);
            return;
        }

        message.readString('utf-8', function(error, body) {

            if (error) {
                console.log('read message error ' + error.message);
                return;
            }

            console.log('===test.payAnalysis.queue.data==='+Date.now()+'====' + body);

            message.ack();

            //client.disconnect();
        })
    })

    client.on('error', function(error) {

        console.log(error,client.reconnect)
    })
})
