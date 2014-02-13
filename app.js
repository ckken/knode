/**
 * Created by ken.xu on 14-2-10.
 */
//C配置文件 M通用模块插件 F 内置函数 D 数据库类

//================主模块=========================
var koa = require('koa'),
    route = require('koa-route'),
    static = require('koa-static'),
    swig = require('swig'),
    app = koa(),
    path = require('path'),
    co = require('co'),
    parse = require('co-body'),
    views = require('co-views'),
    compose = require('koa-compose'),
    mongoose = require('mongoose');



//===================自定义部分=====================
global.C = global.M = global.F = global.G =  {};
//获取配置内容
C = require(__dirname+'/config/config')(__dirname);

//定义模版类型以及路径
/*swig.setDefaults({
 autoescape:false
 });*/

var render = G.render = views(C.view, {
    map: { html: 'swig' }
})

//定义静态模版以及路径
app.use(static(path.join(__dirname, 'static')));


//公共函数定义
F = require(__dirname+'/function/init')(__dirname);


//连接数据库
M.mongoose = mongoose;
M.mongoose.connect(C.mongo);
D = require(C.model+'db');
//密钥
app.keys = [C.secret];
//全局函数
app.use(function *(next){
    if(!G.tag){
        G.tag = yield function(fn){
            D('tag').find({},function(err,d){
                if(err)fn(err);
                fn(null,d);
            })
        }
    }

    //if(!G.user){//当一个用户时 可以跨浏览器调用
        var user = this.cookies.get('member',{ signed: true });
        G.user = user && JSON.parse(user) || {};
    //}



    //权限控制
    if(this.request.url.indexOf('tag')>=0){
        var ref = this.request.header.referer;
         if(G.user.status!=1){
         this.body = yield F.msg('无权限操作',ref);
         return ;
         }
    }



    yield next;
});

//进入路由==================================
var mod = ['blog','tag','auth','comment'];
mod.forEach(function (item) {
    require(C.controller + item + '.js')(item,app,route,parse,render);
})

//404页面
app.use(function *pageNotFound(next){
    this.body = yield render('404');
});


app.listen(C.port);
console.log('listening on port '+C.port);
