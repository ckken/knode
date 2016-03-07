import request from 'request';
//Promise.promisifyAll(request)

let cache = {}    //用于缓存活动数据信息

module.exports = (io) => {


    let member_mod = D.model('activity_yhb_member')
    let yhb_mod = D.model('activity_yhb_analysis')
    let signin_mod = D.model('activity_signin')


    //设置入口 定义命名空间
    let sc_screen = io.of('/activity/redpack/analysis/screen');
    let sc_client = io.of('/activity/redpack/analysis/client');
    let sc_admin = io.of('/activity/redpack/analysis/admin');

    //获取用户信息
    let getMembers = async (aid, limit = 10)=> {
        return await member_mod.find({
                where: {aid: aid,play:true,redpack:{'>':0}},
                select: ['nickname', 'headimgurl', 'redpack']
            }).limit(limit).sort({
                redpack: 'desc',
                updatedAt: 'desc',

            }).toPromise() || []
    }

    let ylpHost = '/mobile/lottery/config/'

    function ylpUrl(host) {
        return host + ylpHost
    }

    function getData(url, token) {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                headers: {'token': token}
            }, (error, response, body)=> {
                if (!error && response.statusCode == 200) {
                    let d = JSON.parse(body);
                    resolve(d)
                } else {
                    reject(error)
                }
            })
        })

    }

    //  **********************************屏幕端初始化连接************************************
    sc_screen.on('connection', async (socket)=> {
        //定位所在房间
        socket.on('init', async (d)=> {
            //console.log('----------init-------------',d)
            if (d.id) {
                socket.roomId = d.id
                socket.join(socket.roomId);
                let signin_activity = await signin_mod.find({redPackUrl:socket.roomId}).toPromise()
             //   console.log(signin_activity)
                signin_activity = signin_activity[0] || {}
                if(signin_activity.id){
             //       console.log(signin_activity.id)
                    sc_screen.in(socket.roomId).emit('sign_id', signin_activity.id)
                }
                cache[socket.roomId] = cache[socket.roomId] || {}
                if(!cache[socket.roomId].analysis){
                 //   console.log("-----------------read cache-------------------")
                    let analysis_client = await yhb_mod.find({aid: socket.roomId}).toPromise()
                    analysis_client = analysis_client[0] || false
                    cache[socket.roomId].analysis = analysis_client
                   console.log("cache:",cache[socket.roomId].analysis)
                }
                //缓存处理
             //   console.log("-------------------------screen_cache--------------------")
           //      console.log(cache[socket.roomId])
                cache[socket.roomId].analysis = cache[socket.roomId].analysis || false
                cache[socket.roomId].activity = cache[socket.roomId].activity || false

                let members = await getMembers(socket.roomId)
                sc_screen.in(socket.roomId).emit('analysis', cache[socket.roomId].analysis)
                sc_screen.in(socket.roomId).emit('members', members)
                sc_screen.in(socket.roomId).emit('begin_service', cache[socket.roomId].analysis.shakeBol || false)

            }
        })

        socket.on('begin', async (d)=> {
            if (cache[socket.roomId].analysis) {
                d = d && true || false
                cache[socket.roomId].analysis.shakeBol = d
                //更新状态
                await yhb_mod.update({aid: socket.roomId}, cache[socket.roomId].analysis).toPromise()
            }
            console.log('======begin======', d)
            sc_client.in(socket.roomId).emit('begin_client', d)
            sc_screen.in(socket.roomId).emit('begin_service', d)
        })

        socket.on('refresh', async (d)=> {
            if(d){
                if(cache[d.id].token){
                    let token = cache[d.id].token
                    let ylpHost = ylpUrl(d.host)
                    let activity = await getData(ylpHost + d.id, token)
         //           console.log("act:",activity)
                    if (activity && activity.code == 0) {
                        activity = activity.data
                        cache[d.id].analysis.redpackNumber = activity.activityInfo && activity.activityInfo.giftCount || 0
                        cache[d.id].analysis.leftNumber = activity.activityInfo && activity.activityInfo.leftGiftCount || 0
                        sc_screen.in(d.id).emit('analysis', cache[d.id].analysis)
                    }
                }

            }
        })

        //断开连接
        socket.on('disconnect', async ()=> {

        })

    })

    //**********************************手机客户端初始化连接***********************************
    sc_client.on('connection', async (socket)=> {
        //定位所在房间
        socket.on('init', async (d)=> {
            //console.log("one user came in")
            if (d.id) {
                socket.roomId = d.id
                socket.join(socket.roomId);
                //缓存处理
                cache[socket.roomId] = cache[socket.roomId] || {}
                cache[socket.roomId].analysis = cache[socket.roomId].analysis || false
                cache[socket.roomId].activity = cache[socket.roomId].activity || false
                //
                if (d.member && d.member.token && d.host) {


                    if (!cache[socket.roomId].activity) {

                        let ylpHost = ylpUrl(d.host)
                        console.log(ylpHost)
                        let activity = await getData(ylpHost + d.id, d.member.token)
                        console.log("act:",activity)
                        if (activity && activity.code == 0) {
                            activity = activity.data
                            //
                            sc_client.in(socket.roomId).emit('init_client', {
                                activity: activity
                            })
                        }
                        cache[socket.roomId].activity = activity
                        cache[socket.roomId].token = d.member.token
                    }
                    sc_client.in(socket.roomId).emit('init_client', {
                        activity: cache[socket.roomId].activity
                    })
                    cache[socket.roomId].token = d.member.token
                    //获取会员数
                    socket.member = await member_mod.find({
                            aid: socket.roomId,
                            openid: d.member.openid
                        }).toPromise() || []
                    //console.log('----------init socket.member-------------',socket.member)
                    if (socket.member.length == 0) {
                   //     console.log("-----------------is_first_play:true---------------------")
                    //    is_first_play = true
                        let memberData = d.member
                        memberData.aid = socket.roomId
                        memberData.is_first_play = true
                        socket.member = await member_mod.create(memberData).toPromise()
                        //console.log('----------init create member-------------',socket.member)
                    } else {
                    //    console.log("-----------------is_first_play:false---------------------")
                        socket.member = socket.member[0]
                    }
                    //console.log('----------init socket.member-------------',socket.member)
                    //获取礼品数量
                    let redpackNumber = cache[socket.roomId].activity.activityInfo && cache[socket.roomId].activity.activityInfo.giftCount || 0
                    let leftNumber = cache[socket.roomId].activity.activityInfo && cache[socket.roomId].activity.activityInfo.leftGiftCount || 0
                    //console.log("left:----------------------------",cache[socket.roomId].activity)
                    //
                    if (!cache[socket.roomId].analysis || cache[socket.roomId].analysis.redpackNumber == 0) {
                        //获取统计数据 补全数据
                        let analysis = await yhb_mod.find({aid: socket.roomId}).toPromise()
                        analysis = analysis[0] || false
                        if (!analysis) {
                            //创建统计数据 同步api 数据
                            analysis = await yhb_mod.create({
                                aid: socket.roomId,
                                redpackNumber: redpackNumber,
                                leftNumber: leftNumber
                            }).toPromise()
                        }
                        //补全已经参与人员数据
                        analysis.playMember = await member_mod.count({aid: socket.roomId,play:true}).toPromise()
                        //赋值
                        cache[socket.roomId].analysis = analysis
                        console.log("--------------client_cache-----------------")
                        console.log(cache[socket.roomId].analysis)
                    } else {
                        cache[socket.roomId].analysis.playMember = await member_mod.count({aid: socket.roomId,play:true}).toPromise()
                    }
                    let members = await getMembers(socket.roomId)
                    sc_screen.in(socket.roomId).emit('members', members)
                    sc_screen.in(socket.roomId).emit('analysis', cache[socket.roomId].analysis)
                }
                sc_client.in(socket.roomId).emit('begin_client', cache[socket.roomId].analysis.shakeBol || false)

            }
        })

        socket.on('play', async (d)=> {
            //console.log(socket.roomId,socket.member,cache[socket.roomId])
            console.log('--------------play---' + Date.now() + '------------------', socket.member.nickname)
            if (socket.roomId) {
                //console.log('play socket.roomId',socket.roomId)
                if (socket.member) {
                    //console.log('play socket.member',socket.member)
                    cache[socket.roomId].analysis.playTime = cache[socket.roomId].analysis.playTime + 1
                    //更新状态
                    socket.member.play = true
                    await member_mod.update({
                        aid: socket.roomId,
                        openid: socket.member.openid
                    }, socket.member).toPromise()
                    if(socket.member.is_first_play == true){
                   //     console.log("-----------------playMember +1 ---------------------")
                        cache[socket.roomId].analysis.playMember = cache[socket.roomId].analysis.playMember + 1
                        socket.member.is_first_play = false
                        await member_mod.update({
                            aid: socket.roomId,
                            openid: socket.member.openid
                        }, socket.member).toPromise()
                    }
                    await yhb_mod.update({aid: socket.roomId}, cache[socket.roomId].analysis).toPromise()
                    sc_screen.in(socket.roomId).emit('analysis', cache[socket.roomId].analysis)
                }

            }

            if (cache[socket.roomId]) sc_screen.in(socket.roomId).emit('analysis', cache[socket.roomId].analysis)
        })

        socket.on('pick', async (d)=> {
            console.log('================pick====' + Date.now() + '====price==' + d + '==float==' + parseFloat(d) + '====', socket.member.redpack, socket.member.nickname)
            //console.log(cache[socket.roomId].analysis)
            if (socket.roomId && d > 0) {
                if (socket.member) {
                    let redpack = parseFloat(d) || 0
                    if (redpack > 0) {
                        //会员获取的总红包数
                        socket.member.redpack = socket.member.redpack || 0
                        socket.member.redpack = socket.member.redpack + redpack
                        //更新会员获取的钱 排名前10的会员
                        socket.member.play = true
                        await member_mod.update({
                            aid: socket.roomId,
                            openid: socket.member.openid
                        }, socket.member).toPromise()
                        let play_members = await getMembers(socket.roomId)
                        sc_screen.in(socket.roomId).emit('members', play_members)
                        //剩下红包状态
                        if (cache[socket.roomId].analysis.leftNumber > 0) {
                            cache[socket.roomId].analysis.leftNumber = cache[socket.roomId].analysis.leftNumber - 1
                            //更新状态
                            await yhb_mod.update({aid: socket.roomId}, cache[socket.roomId].analysis).toPromise()
                        }
                    }
                }
                //
                let members = await getMembers(socket.roomId)
                let redpack_msg = {}
                redpack_msg.user = {}
                redpack_msg.user.headimgurl = socket.member.headimgurl
                redpack_msg.user.nickname = socket.member.nickname
                redpack_msg.msg = "抢到了"+parseFloat(d)+"元红包"
                sc_screen.in(socket.roomId).emit('redpack_msg',redpack_msg)
                sc_screen.in(socket.roomId).emit('members', members)
                sc_screen.in(socket.roomId).emit('analysis', cache[socket.roomId].analysis)
            }
        })

        //断开连接
        socket.on('disconnect', async ()=> {

        })

    })

    //  **********************************后台管理端初始化连接************************************
    sc_admin.on('connection', async (socket)=> {
        socket.on('change_config', async (d)=> {
            if(d){
                cache[d.id].activity.redpackNumber = d.redpackNumber
                cache[d.id].activity.leftNumber = d.leftNumber
                sc_screen.in(d.id).emit('analysis', cache[socket.roomId].analysis)
            }
        })
    })

}