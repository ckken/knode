import request from 'request';
//Promise.promisifyAll(request)

let cache = {}    //用于缓存活动数据信息

module.exports = (io) => {


    let member_mod = D.model('activity_yhb_member')
    let yhb_mod = D.model('activity_yhb_analysis')


    //设置入口 定义命名空间
    let sc_screen = io.of('/activity/redpack/analysis/screen');
    let sc_client = io.of('/activity/redpack/analysis/client');

    //获取用户信息
    let getMembers = async (aid, limit = 10)=> {
        return await member_mod.find({
                where: {aid: aid},
                select: ['nickname', 'headimgurl', 'redpack']
            }).limit(limit).sort({
                redpack: 'desc',
                id: 'asc'
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
                //缓存处理
                cache[socket.roomId] = cache[socket.roomId] || {}
                cache[socket.roomId].analysis = cache[socket.roomId].analysis || false
               // cache[socket.roomId].activity = cache[socket.roomId].activity || false

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
                        let activity = await getData(ylpHost + d.id, d.member.token)
                        if (activity && activity.code == 0) {
                            activity = activity.data
                            //
                            sc_client.in(socket.roomId).emit('init_client', {
                                activity: activity
                            })
                        }
                        cache[socket.roomId].activity = activity
                    }

                    //获取会员数
                    socket.member = await member_mod.find({
                            aid: socket.roomId,
                            openid: d.member.openid
                        }).toPromise() || []
                    //console.log('----------init socket.member-------------',socket.member)
                    if (socket.member.length == 0) {
                        let memberData = d.member
                        memberData.aid = socket.roomId
                        socket.member = await member_mod.create(memberData).toPromise()
                        //console.log('----------init create member-------------',socket.member)
                    } else {
                        socket.member = socket.member[0]
                    }
                    //console.log('----------init socket.member-------------',socket.member)
                    //获取礼品数量
                    let redpackNumber = cache[socket.roomId].activity.activityInfo && cache[socket.roomId].activity.activityInfo.giftCount || 0
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
                                leftNumber: redpackNumber
                            }).toPromise()
                        }
                        //补全已经参与人员数据
                        analysis.playMember = await member_mod.count({aid: socket.roomId}).toPromise()
                        //赋值
                        cache[socket.roomId].analysis = analysis
                    } else {
                        cache[socket.roomId].analysis.playMember = await member_mod.count({aid: socket.roomId}).toPromise()
                    }

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
                    await yhb_mod.update({aid: socket.roomId}, cache[socket.roomId].analysis).toPromise()
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
                        await member_mod.update({
                            aid: socket.roomId,
                            openid: socket.member.openid
                        }, socket.member).toPromise()
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
                sc_screen.in(socket.roomId).emit('members', members)
                sc_screen.in(socket.roomId).emit('analysis', cache[socket.roomId].analysis)
            }
        })

        //断开连接
        socket.on('disconnect', async ()=> {

        })

    })


}