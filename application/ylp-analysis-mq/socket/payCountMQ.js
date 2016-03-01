/*
 brokerURL=failover\:(tcp\://172.16.8.121\:61616)?randomize\=false&initialReconnectDelay\=1000&maxReconnectDelay\=30000
 userName=ylp
 password=ylp.123
 maxConnections=20
 queueName=test.queue.data
 */


//var client = new Stomp('172.16.8.121', 61616, 'ylp', 'ylp.123');


var Stomp = require('stompjs');
var client = Stomp.overTCP('172.16.8.121', 61616);

console.log(client)
client.connect('ylp','ylp.123', function(d){
        console.log(d)
},function(d){
    console.log('errorLog',d)
})

client.send("test.ylp.queue.notify.v1", {priority: 9}, "Hello, STOMP");
client.subscribe("test.ylp.queue.notify.v1", function(e,d){
    console.log('subscribe',d)
});


module.exports = async (io) => {



}