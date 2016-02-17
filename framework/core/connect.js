import fs from 'fs'

let io = require('socket.io')();

module.exports = (app, db) => {

    db(()=> {

        let server = app.listen(G.port, () => {
            console.log('启动服务端口:' + server.address().port);
        });

        if (G.socket) {
            console.log('启动Socket');
            io.listen(server)

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