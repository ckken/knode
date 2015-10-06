/**
 * Created by ken on 15/8/19.
 */
let io = require('socket.io')();

module.exports = (app,db) =>{

    db(()=>{

        let server = app.listen(G.port,  () =>{
            console.log('启动服务端口:' + server.address().port);
        });

        if(G.socket){
            io.listen(server)
        }
    })
    return io


    /*    io.on('connection', function (_socket) {
     console.log(_socket.id + ': connection');
     _socket.emit('message', 'hello world');
     _socket.on('message', function (msg) {
     console.log('Message Received: ', msg);
     _socket.broadcast.emit('message', msg);
     });
     socket = _socket

     })*/
}

