/**
 * Created by ken.xu on 14-2-10.
 */
/**
 *
 * @param root 根目录
 * @param kpath 库目录
 */
module.exports = function(root, kpath) {

    /**
     * ===================自定义部分=====================
     * C全局静态配置
     * D全局数据模型
     * G全局动态变量
     * M全局外部模块调用
     * R全局请求
     */

    global.C = {};
    //global.M = {};
    global.F = {};
    global.G = {};
    //global.R = {};


    //C配置文件 M通用模块插件 F 内置函数 D 数据库类

    //================主模块=========================
    var koa = require('koa'),
        staticCache = require('koa-static-cache'),
        //static = require('koa-static'),
        swig = require('swig'),
        app = koa(),
        path = require('path'),
        fs = require('fs'),
        //
        co = require('co'),
        //parse = require('co-body'),
        bodyParser = require('koa-bodyparser'),
       // views = require('co-views'),
        combo = require('koa-combo')


    global._ = require('lodash');

   
    //===================获取配置内容
    var systemConfig = require(kpath + '/config')(root);
    var clientConfig = require(root + '/config/config')(root);
    _.extend(systemConfig, clientConfig);
    C = systemConfig;

    //===================缓存配置
    C.debug = {};
    C.debug.common = false; //全局debug
    C.debug.logger = true; //请求debug
    C.debug.db = true; //数据库debug

    //===================debug module
    if (C.debug.common || C.debug.logger) {
        var logger = require('koa-logger');
        app.use(logger());
    }


    //===================定义模版类型以及路径
    require('koa-swig')(app, {
        root: C.view,
        autoescape: true,
        //cache: 'memory', // disable, set to false
        ext: 'html',
        //locals: locals,
        //filters: filters,
        //tags: tags,
        //extensions: extensions
    });

    //post 处理 this.request.body;
    app.use(bodyParser());
    //路由

    //定义静态模版以及路径
    /*app.use(staticCache(path.join(root, 'static'), {
        maxAge: 365 * 24 * 60 * 60
    }))*/
    var static_root = path.join(root, 'static');
   app.use(staticCache(static_root, {
       maxAge: 860000000,
       gzip:true
       }));

    //静态文件加载
    app.use(combo([static_root]));

    //公共函数定义 合并 lodash
    var styleFn = require(kpath + '/function/init')(kpath);
    //F = _;
    _.extend(F, styleFn);

    //model 初始化
    require(kpath+'model')(app,fs)


    //密钥
    app.keys = [C.secret];
    //favicon 特殊处理


    app.use(function * (next) {
        //非favicon 直接跳过
        if ('/favicon.ico' != this.path) return yield next;
        //头部定义防止 404
        if ('GET' !== this.method && 'HEAD' !== this.method) {
            this.status = 'OPTIONS' == this.method ? 200 : 405;
            this.set('Allow', 'GET, HEAD, OPTIONS');
            return;
        }
    });

    require(kpath+'controller')(app,fs)



    //404页面
    app.use(function * pageNotFound(next) {
        this.body = yield this.render('404');
    });

    /**
     * 监听端口
     */
    app.listen(C.port);
    console.log('listening on port ' + C.port);

    /**
     * 错误处理
     */
    app.on('error', function(err) {
        console.log('server error', err);
    });

}
