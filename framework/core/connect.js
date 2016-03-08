import fs from 'fs'

let io = require('socket.io')();


module.exports = (app, db) => {

    db(()=> {

        let server = app.listen(G.port, () => {
            console.log('启动服务端口:' + server.address().port);
        });

        if (G.system_mod.indexOf('socket')>-1) {
            console.log('启动Socket');
            io.listen(server)
            //如果启动redis 会默认启动集群方案 支持 pm2 的 cluster
            if(G.redis){
                let redis = require('socket.io-redis');
                io.adapter(redis({ host: G.redis.host, port: G.redis.port,auth_pass: G.redis.password }));
            }
            //监听所有 socket 文件夹的.js文件 注册给socket.io
            if (fs.existsSync(G.path.app + '/socket')) {
                fs.readdirSync(G.path.app + '/socket').forEach((name)=> {
                    if (name.indexOf('.js') > -1) {
                        require(G.path.app + '/socket/' + name)(io);
                    }
                })
            }
        }
        return io

    })
}