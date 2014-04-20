/**
 * Created by ken.xu on 14-2-10.
 */
module.exports = function (root, kpath) {


//C配置文件 M通用模块插件 F 内置函数 D 数据库类

//================主模块=========================
    var koa = require('koa'),
        route = require('koa-route'),
        //static = require('koa-static'),
        staticCache = require('koa-static-cache'),
        swig = require('swig'),
        app = koa(),
        path = require('path'),
        co = require('co'),
        parse = require('co-body'),
        views = require('co-views'),
        compose = require('koa-compose'),
        mongoose = require('mongoose');


//===================自定义部分=====================
    global.C = global.M = global.F = global.G = {};
//===================获取配置内容
    C = require(root + '/config/config')(root);

//===================缓存配置
    C.debug = {};
    C.debug.common = false;
    C.debug.logger = true;
    C.debug.db = true;

//===================debug module
    if (C.debug.common && C.debug.logger) {
        var logger = require('koa-logger');
        app.use(logger());
    }


//===================定义模版类型以及路径
    /*swig.setDefaults({
     autoescape:false
     });*/

    var render = G.render = views(C.view, {
        map: { html: 'swig' }
    })


//定义静态模版以及路径
//app.use(static(path.join(root, 'static')));
    app.use(staticCache(path.join(root, 'static'), {
        maxAge: 365 * 24 * 60 * 60
    }))

//公共函数定义
    F = require(root + '/function/init')(root);
    F.extend = require(kpath + '/function/extend');


//连接数据库
    M.mongoose = mongoose;
    M.mongoose.connect(C.mongo);
    D = require(C.model + 'db');
//密钥
    app.keys = [C.secret];
//全局函数
    app.use(function
    *(next)
    {

        if (!G.tag) {
            G.tag = yield function (fn) {
                D('tag').find({}, function (err, d) {
                    if (err)fn(err);
                    fn(null, d);
                })
            }
        }

        //if(!G.user){//当一个用户时 可以跨浏览器调用
        var user = this.cookies.get('member');
        G.user = user && JSON.parse(user) || {};
        //}

        //权限控制
        if (this.request.url.indexOf('tag') >= 0) {
            var ref = this.request.header.referer;
            if (G.user.status != 1) {
                this.body = yield F.msg('无权限操作', ref);
                return;
            }
        }

        yield next;
    }
    )
    ;

//进入路由==================================
    var mod = require(root + '/config/route');
    mod.forEach(function (module) {
        require(C.controller + module + '.js')(module, app, route, parse, render);
    })


//404页面
    app.use(function
    *
    pageNotFound(next)
    {
        this.body = yield render('404');
    }
    )
    ;

    /**
     * 监听端口
     */
    app.listen(C.port);
    console.log('listening on port ' + C.port);

    /**
     * 错误处理
     */
    app.on('error', function (err) {
        log.error('server error', err);
    });

}
