const knode = require('../lib/index').default
const instance = new knode()
instance.run({
    port:6666,
    ent:'test',
    root_path:__dirname,
    app_path:__dirname+'/src',
    project_name:'',//项目名称 默认为文件名
})