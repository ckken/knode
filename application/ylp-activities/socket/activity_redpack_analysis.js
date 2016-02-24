import request from 'request';
//Promise.promisifyAll(request)



let cache = {}
module.exports = (io) => {


    let member_mod = D.model('activity_yhb_member')
    let yhb_mod = D.model('activity_yhb_analysis')


    //设置入口 定义命名空间
    let sc = io.of('/activity/redpack/analysis');

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

    //let ylpHost = 'http://m.yolipai.com/mobile/lottery/config/'
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
    //
    sc.on('connection', async (socket)=> {
        //定位所在房间
        socket.on('init', async (d)=> {
            console.log('----------init-------------',d)
            if (d.id) {
                socket.roomId = d.id
                socket.join(socket.roomId);
                //缓存处理
                cache[socket.roomId]  = cache[socket.roomId] ||{}
                cache[socket.roomId].analysis = cache[socket.roomId].analysis || false
                //console.log('init',cache[socket.roomId])
                //
                if (d.member && d.member.token && d.host) {

                    let ylpHost = ylpUrl(d.host)
                    socket.activity = await getData(ylpHost + d.id, d.member.token)
                    console.log('----------init socket.activity-------------',socket.activity)
                    if (socket.activity && socket.activity.code == 0) {
                        socket.activity = socket.activity.data
                        //
                        sc.in(socket.roomId).emit('init_client', {
                            activity: socket.activity
                        })
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

                        }else{
                            socket.member = socket.member[0]
                        }

                        //console.log('----------init socket.member-------------',socket.member)
                    }
                }
                //
                if(!cache[socket.roomId].analysis && socket.activity) {
                    //获取统计数据
                    let analysis = await yhb_mod.find({aid: socket.roomId}).toPromise()
                    analysis = analysis[0] || false
                    //获取礼品数量
                    let redpackNumber = socket.activity.activityInfo && socket.activity.activityInfo.giftCount || 0
                    //
                    if (!analysis) {
                        //创建统计数据 同步api 数据
                        analysis = await yhb_mod.create({
                            aid: socket.roomId,
                            redpackNumber: redpackNumber,
                            leftNumber: redpackNumber
                        }).toPromise()
                    } else if (analysis.redpackNumber == 0) {
                        //更新统计数据状态
                        analysis = await yhb_mod.update({aid: socket.roomId}, {
                            redpackNumber: redpackNumber,
                            leftNumber: redpackNumber
                        }).toPromise()
                        analysis = analysis[0]
                    }
                    //console.log('=========analysis===============',analysis)

                    //补全已经参与人员数据
                    analysis.playMember = await member_mod.count({aid: socket.roomId}).toPromise()
                    //赋值
                    cache[socket.roomId].analysis = analysis
                }
                else if(cache[socket.roomId].analysis && socket.activity){
                    //补全已经参与人员数据
                    cache[socket.roomId].analysis.playMember = await member_mod.count({aid: socket.roomId}).toPromise()
                }else if(!cache[socket.roomId].analysis && !socket.activity){
                    cache[socket.roomId].analysis = await yhb_mod.find({aid: socket.roomId}).toPromise()
                    cache[socket.roomId].analysis = cache[socket.roomId].analysis[0] || {}
                }
                //提交内容
                let members = await getMembers(socket.roomId)
                sc.in(socket.roomId).emit('analysis', cache[socket.roomId].analysis)
                sc.in(socket.roomId).emit('members', members)
                sc.in(socket.roomId).emit('begin_client', cache[socket.roomId].analysis.shakeBol||false)
                sc.in(socket.roomId).emit('begin_service', cache[socket.roomId].analysis.shakeBol||false)

                //console.log('----------cache[socket.roomId].analysis-----',cache[socket.roomId].analysis)
            }
        })

        socket.on('play', async (d)=> {
            console.log(socket.roomId,socket.member,cache[socket.roomId])
            console.log('--------------'+Date.now()+'------------------')
            if (socket.roomId) {
                //console.log('play socket.roomId',socket.roomId)
                if(socket.member) {
                    //console.log('play socket.member',socket.member)
                   cache[socket.roomId].analysis.playTime =cache[socket.roomId].analysis.playTime + 1
                    //更新状态
                    await yhb_mod.update({aid: socket.roomId},cache[socket.roomId].analysis).toPromise()
                }
            }

            if(cache[socket.roomId])sc.in(socket.roomId).emit('analysis',cache[socket.roomId].analysis)
        })

        socket.on('pick', async (d)=> {
            console.log('================pick==========')
            console.log(cache[socket.roomId].analysis)
            if (socket.roomId) {
                if(socket.member) {
                    let redpack = parseInt(d) || 0
                    if (redpack > 0) {
                        //会员获取的总红包数
                        socket.member.redpack = socket.member.redpack || 0
                        socket.member.redpack = socket.member.redpack + redpack
                        //更新会员获取的钱 排名前10的会员
                        await member_mod.update({aid: socket.roomId, openid: socket.member.openid}, socket.member).toPromise()
                        //剩下红包状态
                        if(cache[socket.roomId].analysis.leftNumber>0) {
                            cache[socket.roomId].analysis.leftNumber = cache[socket.roomId].analysis.leftNumber - 1
                            //更新状态
                            await yhb_mod.update({aid: socket.roomId}, cache[socket.roomId].analysis).toPromise()
                        }
                    }
                }
                //
                let members = await getMembers(socket.roomId)
                sc.in(socket.roomId).emit('members', members)
                sc.in(socket.roomId).emit('analysis',cache[socket.roomId].analysis)
            }
        })

        socket.on('begin', async (d)=> {
            if(cache[socket.roomId].analysis) {
                d = d && true || false
               cache[socket.roomId].analysis.shakeBol = d
                //更新状态
                await yhb_mod.update({aid: socket.roomId},cache[socket.roomId].analysis).toPromise()
            }
            sc.in(socket.roomId).emit('begin_client', d)
            sc.in(socket.roomId).emit('begin_service', d)
        })


        //断开连接
        socket.on('disconnect', async ()=> {

        })

    })


}