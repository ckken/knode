module.exports = (io) => {


    let room = {}
    let model = D.model('activity_signin_member')
    let model_activity = D.model('activity_signin')
    var getRoomList = async (aid)=> {
        return await model.find({where: {aid: aid}, select: ['nickname', 'headimgurl', 'online']}).sort({
                online: 'desc',
                id: 'asc'
            }).toPromise() || []
    }

    //设置路由入口
    let signin = io.of('/signin');
    //
    signin.on('connection', function (socket) {


        socket.on('activities_signin_rq_user', async (d)=> {
            let user = await model.findOne({aid: d.id, openid: d.user.openid}).toPromise()
            //console.log(user)
            if (user)signin.in(socket.room).emit('activities_signin_rq_user', user);
        })

        socket.on('activities_signin_login', async (d)=> {
            let data = {phone: d.phone, realname: d.realname}
            let user = await model.update({aid: d.id, openid: d.openid}, data).toPromise()
            if (user)signin.in(socket.room).emit('activities_signin_login', data);
        })


        socket.on('activities_signin_danmu', async (d)=> {
            //console.log(d)
            signin.in(socket.room).emit('activities_signin_danmu', d);
        })

        socket.on('activities_signin_msg', async (d)=> {
            if (d.id) {
                let activity = await model_activity.findOne({id: d.id}).toPromise()
                console.log(activity)
                socket.emit('activities_signin_msg', activity);
            }
        })

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