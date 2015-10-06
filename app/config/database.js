module.exports = {
    db:{
        connections: {
            aliyun: {
                adapter: 'mongo',
                //host: '127.0.0.1', // defaults to `localhost` if omitted
                host:'wvovo.com',
                port: 27017, // defaults to 27017 if omitted
                user: 'weixin', // or omit if not relevant
                password: '666666', // or omit if not relevant
                database: 'weixin_dev' // or omit if not relevant
            }
        }
    },
    port:8300
}