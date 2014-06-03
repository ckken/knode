/**
 * Created by ken.xu on 14-2-10.
 */
/**
 *
 * @param root 根目录
 * @param kpath 库目录
 */
module.exports = function (root, kpath) {

    /**
     * ===================自定义部分=====================
     * C全局静态配置
     * D全局数据模型
     * G全局动态变量
     * M全局外部模块调用
     * R全局请求
     */

    global.C = {};
    global.M = {};
    global.F = {};
    global.G = {};
    global.R = {};


//C配置文件 M通用模块插件 F 内置函数 D 数据库类

//================主模块=========================
    var koa = require('koa'),
        //router = require('koa-route'),
    //static = require('koa-static'),
        staticCache = require('koa-static-cache'),
        swig = require('swig'),
        app = koa(),
        path = require('path'),
        //
        co = require('co'),
        parse = require('co-body'),
        views = require('co-views'),
        compose = require('koa-compose'),
        mongoose = require('mongoose'),
        _ = require('underscore'),
        thunkify = require('thunkify');

    M.thunkify = thunkify;
    //路由定义
    //app.use(router(app));


//===================获取配置内容
    C = require(root + '/config/config')(root);

//===================缓存配置
    C.debug = {};
    C.debug.common = false;//全局debug
    C.debug.logger = true;//请求debug
    C.debug.db = true;//数据库debug

//===================debug module
    if (C.debug.common || C.debug.logger) {
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

//公共函数定义 合并 underscore
    var styleFn = require(kpath + '/function/init')(kpath);
    F = _;
    F.extend(F,styleFn);

//连接数据库
    M.mongoose = mongoose;
    M.mongoose.connect(C.mongo);
    D = require(C.model + 'db');
//密钥
    app.keys = [C.secret];
//全局函数
    app.use(function*(next)
    {


        var mod = require(root + '/config/route');
        R.method = this.request.method;
        R.url = this.request.url.split('?')[0];

        if(R.url!='/favicon.ico'){
            R.url = R.url.split('/');
            //默认值处理
            R.m = R.url[1]||mod[0];//module
            R.c = R.url[2]||mod[1];//controller
            R.a = R.url[3]||mod[2];//action
            R.q = {};
            if(R.url.length>4)meregeRq(R.url);

            var common =  require(C.controller+R.m+'/common.js')(this,render);

            yield common.init();


            if(_.isFunction(common[R.a])){
                yield common[R.a]();
            }else{
                yield next;
            }


        }
    });


    function meregeRq(url){

        var d={};
        for (var i = 2; i < Math.ceil(url.length / 2); i++) {
            d[url[i * 2]] = url[i * 2 + 1]||'';
        }
        R.q =  d||'';
        //:todo 传统的 ?id=1&name=ken的操作
        /*url = R.url.split('?');
        if(url>0){
            url
        }
        ......
        _.extend()

        */

    }


//404页面
    app.use(function *pageNotFound(next){
        this.body = yield render('404');
    });

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
