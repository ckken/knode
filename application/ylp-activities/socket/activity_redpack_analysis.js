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
           // console.log(d)
            if (d.id) {
                socket.roomId = d.id
                socket.join(socket.roomId);
                //
                if (d.member && d.member.token && d.host) {

                    let ylpHost = ylpUrl(d.host)
                    socket.activity = await getData(ylpHost + d.id, d.member.token)
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
                            let memberData = d.member
                            memberData.aid = socket.roomId
                            socket.member = await member_mod.create(memberData).toPromise()
                            socket.member = socket.member[0]
                        }else{
                            socket.member = socket.member[0]
                        }
                       // socket.member = d.member


                    }
                    //console.log(socket.activity)
                }

                //获取统计数据
                socket.analysis = await yhb_mod.find({aid: socket.roomId}).toPromise()
                let redpackNum = 0



                if ((!socket.analysis || socket.analysis.length == 0)&&socket.activity) {
                    redpackNum = socket.activity.activityinfo&&socket.activity.activityinfo.giftCount||0
                    socket.analysis = await yhb_mod.create({aid: socket.roomId,redpackNumber:redpackNum}).toPromise()
                }
                socket.analysis = socket.analysis[0]
                socket.analysis.redpackNumber = socket.analysis.redpackNumber ||redpackNum
                socket.analysis.leftNumber = socket.analysis.redpackNumber
                //socket.analysis = socket.activity.activityConfig.checkNum

                //补全已经参与人员数据
                //if(socket.analysis.playMember===0){
                    socket.analysis.playMember = await member_mod.count({aid: socket.roomId}).toPromise()

                //}

                let members = await getMembers(socket.roomId)
                sc.in(socket.roomId).emit('analysis', socket.analysis)
                sc.in(socket.roomId).emit('members', members)
                sc.in(socket.roomId).emit('begin_client', socket.analysis.shakeBol||false)
            }
        })

        socket.on('play', async (d)=> {

            if (socket.roomId) {
                if(socket.member) {
                    socket.analysis.playTime = socket.analysis.playTime + 1
                    //更新状态
                    await yhb_mod.update({aid: socket.roomId}, socket.analysis).toPromise()
                }
            }

            sc.in(socket.roomId).emit('analysis', socket.analysis)
        })

        socket.on('pick', async (d)=> {

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
                        socket.analysis.leftNumber = socket.analysis.leftNumber -1
                        //更新状态
                        await yhb_mod.update({aid: socket.roomId}, socket.analysis).toPromise()
                    }
                }
                //
                let members = await getMembers(socket.roomId)
                sc.in(socket.roomId).emit('members', members)
                sc.in(socket.roomId).emit('analysis', socket.analysis)
            }
        })

        socket.on('begin', async (d)=> {
            if(socket.analysis) {
                d = d && true || false
                socket.analysis.shakeBol = d
                //更新状态
                await yhb_mod.update({aid: socket.roomId}, socket.analysis).toPromise()
            }
            sc.in(socket.roomId).emit('begin_client', d)
        })


        //断开连接
        socket.on('disconnect', async ()=> {

        })

    })


}