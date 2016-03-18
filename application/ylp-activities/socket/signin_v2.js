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
        return await member_mod.find({where: {aid: aid,in_room:true}, select: ['nickname', 'headimgurl', 'online']}).sort({
                online: 'desc',
                id: 'desc'
            }).toPromise() || []
    }

    //在线用户数统计
    let onlineMembers = async (socket)=>{
        var online = 0
        _.forEach(socket.members,function(v,k){
            if(v.online){
                online++
            }
        })
        return online
        //return await member_mod.count({aid: socket.roomId,in_room:true}).toPromise()
    }

    //*********************初始化后台管理连接*********************
    admin.on('connection',async (socket)=>{
        socket.on('forbid',async (d)=>{
            if(d && d.member){
                socket.member = d.member
                //console.log("------------------------------------on:forbid>d.member-------------------------------------------")
                //console.log(d.member)
                //         socket.member.is_forbid = (d.isForbid===false)?false:true
                let member_temp =  await member_mod.findOne({aid: d.member.aid, openid: d.member.openid}).toPromise() || false
                socket.member.online = member_temp.online

                let client_data = {
                    "openid" : d.member.openid,
                    "is_forbid" : socket.member.is_forbid
                }
                await member_mod.update({aid: d.member.aid, openid: d.member.openid}, socket.member).toPromise()
                client.in(d.member.aid).emit('forbid_switch',client_data)
                //console.log("-------------------------forbid switch--------------------------------")
                //console.log(client_data)
            }
        })
        socket.on('getout',async (d)=>{
            if(d && d.member){
                d.member.in_room = (d.member.in_room===true)?true:false
                //  console.log()
                //  console.log(d.member)
                await member_mod.update({aid: d.member.aid, openid: d.member.openid}, d.member).toPromise()
                //     let temp = await member_mod.findOne({aid: d.member.aid, openid: d.member.openid}).toPromise()
                //       console.log("temp:",temp)
                client.in(d.member.aid).emit('client_getout',{openid: d.member.openid,getout: d.member.in_room})
            }
        })
    })



    //*********************初始化客户端连接*********************
    client.on('connection', async (socket)=> {
        //定位所在房间
        socket.on('init', async (d)=> {
            if(d.id&&d.member) {
                socket.signin = await signin_mod.findOne({id: d.id}).toPromise()
                //   console.log(socket.signin)
                if(socket.signin) {
                    socket.roomId = d.id
                    socket.member = await member_mod.findOne({aid: socket.roomId, openid: d.member.openid}).toPromise() || false

                    if (!socket.member) {

                        socket.member = d.member
                        socket.member.online = 1
                        socket.member.in_room = true
                        let data = d.member
                        data.aid = socket.roomId
                        data.is_forbid = false
                        await member_mod.create(data).toPromise()
                        //加入房间
                        socket.join(socket.roomId);

                    } else {
                        //           console.log("---------------member:------------------")
                        console.log("----------------"+socket.member.city+"--"+socket.member.nickname+"签到------------------")
                        if(socket.member.in_room === true){
                            socket.join(socket.roomId);
                            //   console.log("in_room")
                            socket.member.online = 1
                            await member_mod.update({aid: socket.roomId, openid: d.member.openid}, socket.member).toPromise()
                            let member_isForbid = socket.member.is_forbid || false
                            socket.emit('forbid_init',member_isForbid)
                            socket.emit('getout_init',true)
                        }else {
                            socket.emit('getout_init',false)
                        }
                    }

                    //获取所有会员信息
                    socket.members = await getMembers(socket.roomId)
                    socket.members_count = await member_mod.count({aid: socket.roomId,in_room:true}).toPromise()

                    client.in(socket.roomId).emit('init', {
                        signin:socket.signin,
                        //member_count:socket.members.length,
                        member_count:socket.members_count,
                        online:await onlineMembers(socket)
                    });
                    screen.in(socket.roomId).emit('init', {
                        signin:socket.signin,
                        members:socket.members,
                        member_count:socket.members_count,
                        online:await onlineMembers(socket)
                    });
                }
            }
        })

        //发送弹幕
        socket.on('danmu', async (d)=> {
            if(socket.roomId && socket.signin.isDanmu!==false){
                d = {msg: d,user:{nickname:socket.member.nickname,headimgurl:socket.member.headimgurl}}
                console.log(d.user.nickname+" 说： "+d.msg)
                client.in(socket.roomId).emit('danmu', d);
                screen.in(socket.roomId).emit('danmu', d);
            }
        })

        socket.on('request_getout', async(d)=>{
            if(d){
                //          console.log("--------------on:request_getout------------------")
                socket.member.online = 0
                socket.member.in_room = (d===false)?false:true
                await member_mod.update({aid: socket.roomId, openid: socket.member.openid}, socket.member).toPromise()
                socket.members = await getMembers(socket.roomId)
                //
                socket.members_count = await member_mod.count({aid: socket.roomId,in_room:true}).toPromise()
                client.in(socket.roomId).emit('members', {
                    member_count: socket.members_count,
                    online: await onlineMembers(socket)
                })
                screen.in(socket.roomId).emit('members', {
                    members: socket.members,
                    member_count: socket.members_count,
                    online: await onlineMembers(socket)
                })
                socket.leave(socket.roomId)
            }
        })
        //断开连接
        socket.on('disconnect', async ()=> {
            if(socket.member) {
                socket.member.online = 0
                await member_mod.update({aid: socket.roomId, openid: socket.member.openid}, socket.member).toPromise()
                socket.members = await getMembers(socket.roomId)
                //
                socket.members_count = await member_mod.count({aid: socket.roomId,in_room:true}).toPromise()
                client.in(socket.roomId).emit('members', {
                    member_count: socket.members_count,
                    online: await onlineMembers(socket)
                })
                screen.in(socket.roomId).emit('members', {
                    members: socket.members,
                    member_count: socket.members_count,
                    online: await onlineMembers(socket)
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
                    socket.members_count = await member_mod.count({aid: socket.roomId,in_room:true}).toPromise()
                    screen.in(socket.roomId).emit('init', {
                        signin:socket.signin,
                        members:socket.members,
                        member_count: socket.members_count,
                        online:await onlineMembers(socket)
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
             client.in(socket.roomId).emit('members', await member_mod.count({aid: socket.roomId,in_room:true}).toPromise())
             screen.in(socket.roomId).emit('members', socket.members)
             */
        })

    })

}