/**
 * Created by ken.xu on 14-2-10.
 */
var koa = require('koa'),
    app = koa(),
    path = require('path'),
    route = require('koa-route'),
    parse = require('co-body'),
    static = require('koa-static');


app.use(static(path.join(__dirname, 'static')));



//C配置文件 M通用模块插件 F 内置函数 D 数据库类
global.C = global.M = global.F = {};
C = require(__dirname+'/config/config')(__dirname);

//var mod = ['member', 'blog','auth'];
var mod = ['blog'];
mod.forEach(function (item) {
    require(C.controller + item + '.js')(app,route,parse);
})

app.use(function *(){
    this.body = '404';
});

app.listen(3000);

console.log('listening on port 3000');
