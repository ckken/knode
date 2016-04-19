/**
 * Created by ken on 15/7/17.
 */
"use strict";
var express_1 = require('express');
var serve_favicon_1 = require('serve-favicon');
var morgan_1 = require('morgan');
var cookie_parser_1 = require('cookie-parser');
var body_parser_1 = require('body-parser');
var compression_1 = require('compression');
var swig_1 = require('swig');
var fs_1 = require('fs');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function () {
    //express 初始化
    var app = express_1.default();
    //开发环境全局配置
    G.env = app.get('env');
    if (G.env !== 'production')
        G.debug = true;
    // 压缩请求资源
    app.use(compression_1.default({ level: 9 }));
    //favicon使用方式
    if (fs_1.default.existsSync(G.path.root + '/favicon.ico'))
        app.use(serve_favicon_1.default(G.path.root + '/favicon.ico'));
    // 直接解析 G.cdn 文件夹下的静态资源
    if (G.cdn.indexOf('http') === -1)
        app.use(G.cdn, express_1.default.static(G.path.root + '/static', { maxAge: 86400000 }));
    //定义模板 开发环境不缓存模板,模板根路径定位到 view 目录
    //G.path.view = (!G.debug) && G.path.view.replace('/view', '/build/view') || G.path.view
    //swig.setDefaults({cache: false, autoescape: false, loader: swig.loaders.fs(G.path.view)})
    swig_1.default.setDefaults({ cache: false, autoescape: false, loader: swig_1.default.loaders.fs(G.path.module) });
    swig_1.default.setDefaultTZOffset(8);
    app.engine('html', swig_1.default.renderFile);
    app.set('view engine', 'html');
    //app.set('views', G.path.view + '/');
    app.set('views', G.path.module + '/');
    app.set('view cache', false);
    //app.use(display());//display 封装
    //if (G.debug)app.use(logger('dev'));//开发环境性进行debug
    app.use(morgan_1.default('dev')); //开发环境性进行debug
    app.use(body_parser_1.default.json()); //接受json 传输格式 restful 必备
    app.use(body_parser_1.default.urlencoded({ extended: true })); //传统url 传输方式
    app.use(cookie_parser_1.default(G.cookie.secret)); //cookie 使用注册
    //x-powered-by 操作
    //app.set('x-powered-by', 'xxx')
    app.disable('x-powered-by');
    //自定义路由
    if (fs_1.default.existsSync(G.path.config + '/route')) {
        require(G.path.config + '/route')(app);
    }
    // 总路由
    require(G.path.core + '/core/route')(app);
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        var err_msg = {};
        res.status(err.status || 500);
        if (G.debug) {
            err_msg = {
                message: err.message,
                error: err,
                status: err.status,
                code: -1
            };
        }
        else {
            err_msg = {
                message: err.message,
                status: err.status,
                code: -1
            };
        }
        res.json(err_msg);
        if (G.debug && err.status != 404) {
            console.log('======================== error Logs ===========================');
            throw new Error(err);
        }
    });
    return app;
};
//# sourceMappingURL=express.js.map