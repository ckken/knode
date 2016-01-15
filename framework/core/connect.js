/**
 * Created by ken on 15/8/19.
 */
let io = require('socket.io')();



module.exports = (app, db) => {

    db(()=> {

        let server = app.listen(G.port, () => {
            console.log('启动服务端口:' + server.address().port);
        });

        if (G.socket) {
            console.log('启动Socket');
            io.listen(server)
        }


        let room = {}
        //let sigininCount = 0
        let model = D.model('activity_signin_member')

        var getRoomList = async (aid)=>{
            return await model.find({where:{aid:aid},select:['nickname','headimgurl','online']}).sort({online:'desc',id:'asc'}).toPromise()||[]
        }

        let signin = io.of('/signin');
        signin.on('connection', function (socket) {


            //通知大屏人数

            socket.on('activities_signin_screen_room', async (d)=> {
                if(d.id) {
                    socket.room = d.id
                    socket.join(socket.room);
                    //sigininCount = await model.count({aid:socket.room}).toPromise()
                    room[socket.room] = await getRoomList(socket.room)
                    socket.emit('activities_signin_user', room[socket.room]);
                    //io.sockets.in(socket.room).emit('activities_signin_count', sigininCount);
                }
            })

            socket.on('activities_signin_screen_room', async (d)=> {
                if(d.id) {
                    socket.room = d.id
                    socket.join(socket.room);
                    //sigininCount = await model.count({aid:socket.room}).toPromise()
                    room[socket.room] = await getRoomList(socket.room)
                    socket.emit('activities_signin_user', room[socket.room]);
                    //io.sockets.in(socket.room).emit('activities_signin_count', sigininCount);
                }
            })

            //用户加入
            socket.on('activities_signin_room', async (d)=> {

                if(d.id) {
                    socket.room = d.id
                    socket.user = d.user||{}
                    socket.user.online = 1
                    socket.user.aid = d.id

                    socket.join(socket.room);

                    //var index = room[socket.room].indexOf(socket.user);
                    let user = await model.findOne({aid:socket.room,openid:socket.user.openid}).toPromise()||false
                    if(!user){
                        //room[socket.room].unshift(socket.user)
                        await model.create(socket.user).toPromise()
                    }else{
                        await model.update({aid:socket.room,openid:socket.user.openid},socket.user).toPromise()
                    }

                    room[socket.room] = await getRoomList(socket.room)
                    // socket.emit('activities_signin_sys', d.user.nickname + '加入了房间');
                    //socket.broadcast.to(socket.room).emit('activities_signin_user',room);
                    signin.in(socket.room).emit('activities_signin_user', room[socket.room]);


                    //sigininCount = await model.count({aid:socket.room}).toPromise()
                    ///io.sockets.in(socket.room).emit('activities_signin_count', count);
                    //io.sockets.in('another room').emit('activities_signin_sys',room);
                    //console.log(io.sockets.clients(socket.room))

                    //获取所有房间的信息
                    //key为房间名，value为房间名对应的socket ID数组
                    //io.sockets.manager.rooms
                    //获取particular room中的客户端，返回所有在此房间的socket实例
                    //io.sockets.clients('particular room')
                    //通过socket.id来获取此socket进入的房间信息
                    //io.sockets.manager.roomClients[socket.id]
                }
            })

            /*socket.on('leave', function (d) {
                console.log('leave')
                socket.emit('disconnect');
            });*/

            socket.on('disconnect', async function () {
                if(room[socket.room]) {
                    // 从房间名单中移除
                    //let index = room[socket.room].indexOf(socket.user);
                    //console.log('disconnect',index)
                    //console.log(index)
                   // if (index !== -1) {
                   //     room[socket.room].splice(index, 1);
                        //socket.user.online = 0
                        //room[socket.room].push(socket.user)
                    //    room[socket.room][index].online = 0
                    //}
                    socket.user.online = 0
                    await model.update({aid:socket.room,openid:socket.user.openid},socket.user).toPromise()
                    room[socket.room] = await getRoomList(socket.room)
                    signin.in(socket.room).emit('activities_signin_user', room[socket.room]);
                    //io.sockets.in(socket.room).emit('activities_signin_count', sigininCount);
                }

                //socket.emit('sys', user);
            })

            // 接收用户消息,发送相应的房间
            /* socket.on('message', function (msg) {
             // 验证如果用户不在房间内则不给发送
             if (room[roomId].indexOf(user) === -1) {
             return false;
             }
             io.to(roomId).emit('msg', user, msg);
             })*/
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


    })
}

