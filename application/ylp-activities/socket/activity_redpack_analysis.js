import request from 'request';
//Promise.promisifyAll(request)
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

    sc.on('connection', async (socket)=> {
        //定位所在房间
        socket.on('init', async (d)=> {

            if (d.id) {
                socket.roomId = d.id
                socket.join(socket.roomId);
                //
                if (d.member && d.member.token && d.host) {

                    let ylpHost = ylpUrl(d.host)
                    socket.activity = await getData(ylpHost + d.id, d.member.token)
                    console.log(socket.activity.data)
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
                            }).toPromise() || false

                        if (!socket.member || socket.member.length==0) {
                            d.member.isplay = false
                            let memberData = d.member
                            memberData.aid = socket.roomId
                            await member_mod.create(memberData).toPromise()
                        }else{
                            d.member.isplay = true
                        }
                        socket.member = d.member


                    }
                }

                //获取统计数据
                socket.analysis = await yhb_mod.find({aid: socket.roomId}).toPromise()
                if (!socket.analysis || socket.analysis.length == 0) {
                    let redpackNum = socket.activity.activityConfig&&socket.activity.activityConfig.checkNum||0
                    socket.analysis = await yhb_mod.create({aid: socket.roomId,redpackNumber:redpackNum}).toPromise()

                }
                socket.analysis = socket.analysis[0]
                //socket.analysis = socket.activity.activityConfig.checkNum
                let members = await getMembers(socket.roomId)
                sc.in(socket.roomId).emit('analysis', socket.analysis)
                sc.in(socket.roomId).emit('members', members)
            }
        })

        /*
         ,playTime:{type:'integer',defaultsTo:0}
         ,playMember:{type:'integer',defaultsTo:0}
         ,redpackNumber:{type:'integer',defaultsTo:0}
         ,leftNumber:{type:'integer',defaultsTo:0}
         */

        socket.on('play', async (d)=> {

            if (socket.roomId) {
                if(socket.member) {
                    socket.analysis.playTime = socket.analysis.playTime + 1
                    //游戏次数
                    if (!socket.member.isplay) {
                        socket.analysis.playMember = socket.analysis.playMember + 1
                        socket.member.isplay = true
                    }
                    //更新状态
                    yhb_mod.update({aid: socket.roomId}, socket.analysis).exec(function (e, d) {})
                }
            }

            sc.in(socket.roomId).emit('analysis', socket.analysis)
        })

        socket.on('pick', async (d)=> {

            console.log(d)
            if (socket.roomId) {
                if(socket.member) {

                    let redpack = parseInt(d) || 0
                    if (redpack > 0) {
                        socket.member.redpack = socket.member.redpack + redpack
                        //更新状态
                        yhb_mod.update({aid: socket.roomId}, socket.analysis).exec(function(e,d){})
                    }
                    //更新会员获取的钱 排名前10的会员
                    await member_mod.update({aid: socket.roomId, openid: socket.member.openid}, socket.member).toPromise()

                }
                let members = await getMembers(socket.roomId)
                sc.in(socket.roomId).emit('members', members)
                sc.in(socket.roomId).emit('analysis', socket.analysis)
            }
        })

        socket.on('begin', async (d)=> {
            d = d && true || false
            sc.in(socket.roomId).emit('begin_client', d)
        })


        //断开连接
        socket.on('disconnect', async ()=> {

        })

    })


}