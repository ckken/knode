const knode = require('../lib/index').default
const instance = new knode()
instance.run({
    port:6666,
    ent:'test',
    app_path:__dirname+'/application',
    mod:['socket','api'],
})