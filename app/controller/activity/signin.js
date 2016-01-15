export default class extends G.controller.http{


    async index(){
        this.display()
    }

    async room(){
/*// join和leave
        io.on('connection', function(socket){
            socket.join('some room');
            // socket.leave('some room');
        });

// say to room
        io.to('some room').emit('some event'):
        io.in('some room').emit('some event'):*/
        let room = {}
        let roomId = this.req.params.id
        var user = ''
        if(roomId) {
            room[roomId] = room[roomId] ||{}
            room[roomId].user = room[roomId].user || {}


            let io = G.socket;
            io.on('connection', function (socket) {
                console.log('connection')
                //用户加入
                socket.on('join', function (user) {
                    console.log(user)
                    user = user
                    room[roomId].user.push(user)


                    socket.join(roomId);    // 加入房间
                    // 通知房间内人员
                    io.to(roomId).emit('sys', user + '加入了房间', room[roomId]);
                    console.log(user + '加入了' + roomId);
                })

                socket.on('leave', function () {
                    socket.emit('disconnect');
                });

                socket.on('disconnect', function () {
                    // 从房间名单中移除
                    var index = room[roomId].user.indexOf(user);
                    if (index !== -1) {
                        room[roomId].splice(index, 1);
                    }

                    socket.leave(roomId);    // 退出房间
                    socketIO.to(roomId).emit('sys', user + '退出了房间', room[roomId]);
                    console.log(user + '退出了' + roomId);
                })

                // 接收用户消息,发送相应的房间
                socket.on('message', function (msg) {
                    // 验证如果用户不在房间内则不给发送
                    if (room[roomId].indexOf(user) === -1) {
                        return false;
                    }
                    socketIO.to(roomId).emit('msg', user, msg);
                });
            })
        }


    }


}