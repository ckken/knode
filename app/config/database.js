module.exports = {
    db: {
        connections: {
/*            local: {
                adapter: 'mongo',
                host: '172.16.8.213',
                port: 27017,
                user: '',
                password: '',
                database: 'yolipai'
            },*/
            local: {
                adapter: 'mongo',
                host: '127.0.0.1',
                port: 27017,
                user: '',
                password: '',
                database: 'yolipai'
            },

            /*erp: {
                adapter: 'sqlserver',
                host: 'em.it250.cn',
                port: 8952,
                user: 'ylp',
                password: 'ylp.2015',
                database: 'WXD_EM'
            }*/

        }
    },
    socket:true,
    port: 8888
}