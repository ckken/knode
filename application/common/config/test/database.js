export default {
    db: {
        connections: {

            local: {
                adapter: 'mongo',
                host: '14.23.33.122',
                port: 27017,
                user: '',
                password: '',
                database: 'yolipai'
            },
            ylp_analysis: {
                adapter: 'mongo',
                host: '14.23.33.122',
                port: 27017,
                user: '',
                password: '',
                database: 'ylp_analysis'
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
    }
}