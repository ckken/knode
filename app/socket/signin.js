module.exports = (io) => {


    let room = {}
    let model = D.model('activity_signin_member')
    var getRoomList = async (aid)=> {
        return await model.find({where: {aid: aid}, select: ['nickname', 'headimgurl', 'online']}).sort({
                online: 'desc',
                id: 'asc'
            }).toPromise() || []
    }

    let signin = io.of('/signin');
    signin.on('connection', function (socket) {

        //通知大屏人数

        socket.on('activities_signin_screen_room', async (d)=> {
            if (d.id) {
                socket.room = d.id
                socket.join(socket.room);
                room[socket.room] = await getRoomList(socket.room)
                socket.emit('activities_signin_user', room[socket.room]);
            }
        })

        socket.on('activities_signin_screen_room', async (d)=> {
            if (d.id) {
                socket.room = d.id
                socket.join(socket.room);
                room[socket.room] = await getRoomList(socket.room)
                socket.emit('activities_signin_user', room[socket.room]);
            }
        })

        //用户加入
        socket.on('activities_signin_room', async (d)=> {

            if (d.id) {
                socket.room = d.id
                socket.user = d.user || {}
                socket.user.online = 1
                socket.user.aid = d.id

                socket.join(socket.room);
                let user = await model.findOne({aid: socket.room, openid: socket.user.openid}).toPromise() || false
                if (!user) {
                    await model.create(socket.user).toPromise()
                } else {
                    await model.update({aid: socket.room, openid: socket.user.openid}, socket.user).toPromise()
                }

                room[socket.room] = await getRoomList(socket.room)
                signin.in(socket.room).emit('activities_signin_user', room[socket.room]);
            }
        })

        socket.on('disconnect', async function () {
            if (room[socket.room]) {
                // 从房间名单中移除
                socket.user.online = 0
                await model.update({aid: socket.room, openid: socket.user.openid}, socket.user).toPromise()
                room[socket.room] = await getRoomList(socket.room)
                signin.in(socket.room).emit('activities_signin_user', room[socket.room]);
            }
        })
    })
}