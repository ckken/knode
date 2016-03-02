module.exports = (io) => {



    let member_mod = D.model('activity_signin_member')
    let signin_mod = D.model('activity_signin')
    let member


    //设置入口 定义命名空间
    let client = io.of('/signin/v2/client');
    let screen = io.of('/signin/v2/screen');
    let admin = io.of('/signin/v2/admin');


    //获取用户信息
    let getMembers = async (aid)=> {
        return await member_mod.find({where: {aid: aid}, select: ['nickname', 'headimgurl', 'online']}).sort({
                online: 'desc',
                id: 'asc'
            }).toPromise() || []
    }

    //在线用户数统计
    let onlineMembers = function (members){
        var online = 0
        _.forEach(members,function(v,k){
            if(v.online){
                online++
            }
        })
        return online
    }

    //*********************初始化后台管理连接*********************
    admin.on('connection',async (socket)=>{
        socket.on('forbid',async (d)=>{
            if(d && d.member){
                socket.member = d.member
                console.log(d.member)
       //         socket.member.is_forbid = (d.isForbid===false)?false:true
                let member_temp =  await member_mod.findOne({aid: d.member.aid, openid: d.member.openid}).toPromise() || false
                socket.member.online = member_temp.online

                let client_data = {
                    "openid" : d.member.openid,
                    "is_forbid" : socket.member.is_forbid
                }
                await member_mod.update({aid: d.member.aid, openid: d.member.openid}, socket.member).toPromise()
                client.in(socket.roomId).emit('forbid_switch',client_data)
            }
        })
    })



    //*********************初始化客户端连接*********************
    client.on('connection', async (socket)=> {
        //定位所在房间
        socket.on('init', async (d)=> {
            if(d.id&&d.member) {
                socket.signin = await signin_mod.findOne({id: d.id}).toPromise()
                console.log(socket.signin)
                if(socket.signin) {
                    socket.roomId = d.id
                    socket.member = await member_mod.findOne({aid: socket.roomId, openid: d.member.openid}).toPromise() || false

                    if (!socket.member) {

                        socket.member = d.member
                        socket.member.online = 1

                        let data = d.member
                        data.aid = socket.roomId
                        data.is_forbid = false
                        await member_mod.create(data).toPromise()

                    } else {
                        socket.member.online = 1
                        await member_mod.update({aid: socket.roomId, openid: d.member.openid}, socket.member).toPromise()
                        let member_isForbid = socket.member.is_forbid || false
                        socket.emit('forbid_init',member_isForbid)
                    }

                    //获取所有会员信息
                    socket.members = await getMembers(socket.roomId)
                    //加入房间
                    socket.join(socket.roomId);
                    client.in(socket.roomId).emit('init', {
                        signin:socket.signin,
                        member_count:socket.members.length,
                        online:onlineMembers(socket.members)
                    });
                    screen.in(socket.roomId).emit('init', {
                        signin:socket.signin,
                        members:socket.members,
                        online:onlineMembers(socket.members)
                    });
                }
            }
        })

        //发送弹幕
        socket.on('danmu', async (d)=> {
            if(socket.roomId && socket.signin.isDanmu!==false){
                d = {msg: d,user:{nickname:socket.member.nickname,headimgurl:socket.member.headimgurl}}
                client.in(socket.roomId).emit('danmu', d);
                screen.in(socket.roomId).emit('danmu', d);
            }
        })


        //断开连接
        socket.on('disconnect', async ()=> {
            if(socket.member) {
                socket.member.online = 0
                await member_mod.update({aid: socket.roomId, openid: socket.member.openid}, socket.member).toPromise()
                socket.members = await getMembers(socket.roomId)
                //
                client.in(socket.roomId).emit('members', {
                    member_count: socket.members.length,
                    online: onlineMembers(socket.members)
                })
                screen.in(socket.roomId).emit('members', {
                    members: socket.members,
                    online: onlineMembers(socket.members)
                })
            }
        })
    })

    //*********************初始化屏幕连接*********************
    screen.on('connection', async (socket)=> {
        //定位所在房间
        socket.on('init', async (d)=> {
            if(d.id) {
                socket.signin = await signin_mod.findOne({id: d.id}).toPromise()
                if(socket.signin) {
                    socket.roomId = d.id
                    socket.members = await getMembers(socket.roomId)
                    //加入房间
                    socket.join(socket.roomId);
                    screen.in(socket.roomId).emit('init', {
                        signin:socket.signin,
                        members:socket.members,
                        online:onlineMembers(socket.members)
                    })
                }
            }
        })

        //弹幕开关
        socket.on('setDanmu', async (d)=> {
            if(socket.roomId){
                socket.signin.isDanmu = (d===false)?false:true
           //     console.log("--------------------socket.signin.isDanmu--------------------------",socket.signin.isDanmu)
                await signin_mod.update({id: socket.roomId},{isDanmu:socket.signin.isDanmu}).toPromise()
                client.in(socket.roomId).emit('setDanmu', socket.signin.isDanmu);
            }
        })

        //断开连接
        socket.on('disconnect', async ()=> {
            /*
            socket.member.online = 0
            await member_mod.update({aid: socket.roomId, openid: socket.member.openid}, socket.member).toPromise()
            socket.members = await getMembers(socket.roomId)
            client.in(socket.roomId).emit('members', socket.members.length)
            screen.in(socket.roomId).emit('members', socket.members)
            */
        })

    })

}