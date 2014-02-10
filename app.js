/**
 * Created by ken.xu on 14-2-10.
 */
//C配置文件 M通用模块插件 F 内置函数 D 数据库类
global.C = global.M = global.F = {};
//获取配置内容
C = require(__dirname+'/config/config')(__dirname);
//公共函数定义
F = require(__dirname+'/function/init')(__dirname);
//连接数据库
M.mongoose = require('mongoose');
M.mongoose.connect(C.mongo);
D = require(C.model+'db');

var koa = require('koa'),
    path = require('path'),
    parse = require('co-body'),
    views = require('co-views'),
    route = require('koa-route'),
    static = require('koa-static'),
    swig = require('swig'),
    app = koa();



//定义模版类型以及路径
swig.setDefaults({
    autoescape:false
});

var render = views(C.view, {
    map: { html: 'swig' }
})
//定义静态模版以及路径
app.use(static(path.join(__dirname, 'static')));


//var mod = ['member', 'blog','auth'];
var mod = ['blog'];
mod.forEach(function (item) {
    require(C.controller + item + '.js')(app,route,parse,render);
})
//404页面
app.use(function *(){
    this.body = '404';
});

app.listen(3000);

console.log('listening on port 3000');
