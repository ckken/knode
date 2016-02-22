import request from 'request';
//Promise.promisifyAll(request)
module.exports = (io) => {


    let member_mod = D.model('activity_yhb_member')
    let yhb_mod = D.model('activity_yhb_analysis')


    //设置入口 定义命名空间
    let sc = io.of('/activity/redpack/analysis');

    //获取用户信息
    let getMembers = async (aid,limit=10)=> {
        return await member_mod.find({where: {aid: aid}, select: ['nickname', 'headimgurl', 'redpack']}).limit(limit).sort({
                redpack: 'desc',
                id: 'asc'
            }).toPromise() || []
    }

    //let ylpHost = 'http://m.yolipai.com/mobile/lottery/config/'
    let ylpHost = 'http://test-ylp.53123.cn/mobile/lottery/config/'
    function getData(url,token){
        return new Promise((resolve,reject) => {

            request({
                url:url,
                headers: {'token': token}
            },(error, response, body)=>{
                if (!error && response.statusCode == 200) {
                    let d = JSON.parse(body);
                    resolve(d)
                }else{
                    reject(error)
                }
            })
        })

    }

    sc.on('connection', async (socket)=> {
        //定位所在房间
        socket.on('init', async (d)=> {
            if(d.id&&d.member&&d.member.token) {
                socket.activity  = await getData(d.host+'/mobile/lottery/config/'+d.id,d.member.token)
                if(socket.activity) {
                    socket.roomId = d.id
                    //加入房间
                    socket.join(socket.roomId);
                    //
                    sc.in(socket.roomId).emit('init_client', {
                        activity:socket.activity
                    })
                    //获取统计数据
                    socket.analysis = yhb_mod.findOne({aid: socket.roomId}).toPromise()
                    if (!socket.analysis) {
                        let analysis = await yhb_mod.create({aid: socket.roomId}).toPromise()
                        socket.analysis = analysis[0]
                    }
                    //获取会员数
                    socket.member = await member_mod.findOne({aid: socket.roomId , openid: d.member.openid}).toPromise() || false
                    if (!socket.member) {
                        await member_mod.create(d.member).toPromise()
                    }
                    socket.member = d.member
                    socket.member.isPlay = false
                }
            }
        })

        /*
         ,playTime:{type:'integer',defaultsTo:0}
         ,playMember:{type:'integer',defaultsTo:0}
         ,redpackNumber:{type:'integer',defaultsTo:0}
         ,leftNumber:{type:'integer',defaultsTo:0}
         */

        socket.on('play', async (d)=> {

            if(socket.roomId&&socket.member){
                socket.analysis.playTime = socket.analysis.playTime+1
                //游戏次数
                if(!socket.member.isPlay){
                    socket.analysis.playMember = socket.analysis.playMember +1
                    socket.member.isPlay = true
                }
                sc.in(socket.roomId).emit('analysis',socket.analysis)
                //更新状态
                yhb_mod.update({aid: socket.roomId}, socket.analysis).exec()
            }
        })

        socket.on('pick', async (d)=> {
            if(socket.roomId&&socket.member){
                let redpack = parseInt(d)||0
                if(redpack>0) {
                    socket.member.redpack = socket.member.redpack + redpack
                    //更新状态
                    yhb_mod.update({aid: socket.roomId}, socket.analysis).exec()
                }

                //更新会员获取的钱 排名前10的会员
                await member_mod.update({aid: socket.roomId, openid: d.member.openid}, socket.member).toPromise()
                let members = await getMembers()


                sc.in(socket.roomId).emit('members',members)
                sc.in(socket.roomId).emit('analysis',socket.analysis)
            }
        })

        socket.on('begin', async (d)=> {
            d = d&&true||false
            sc.in(socket.roomId).emit('begin_client',d)
        })


        //断开连接
        socket.on('disconnect', async ()=> {

        })

    })


}