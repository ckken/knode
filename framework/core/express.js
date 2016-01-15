/**
 * Created by ken on 15/7/17.
 */


import express from 'express'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import compression from 'compression'
import swig from 'swig'
import fs from 'fs'
//import display from './utils/display'

export default ()=> {
    //express 初始化
    var app = express();
    //开发环境全局配置
    G.env = app.get('env')
    if (G.env !== 'production')G.debug = true
    // 压缩请求资源
    app.use(compression({level: 9}))
    //favicon使用方式
    if (fs.existsSync(G.path.root + '/favicon.ico'))app.use(favicon(G.path.root + '/favicon.ico'));
    // 直接解析 G.cdn 文件夹下的静态资源
    if (G.cdn.indexOf('http') === -1)app.use(G.cdn, express.static(G.path.root + '/static', {maxAge: 86400000}));
    //定义模板 开发环境不缓存模板,模板根路径定位到 view 目录
    G.path.view = (!G.debug) && G.path.view.replace('/view', '/build/view') || G.path.view
    swig.setDefaults({cache: false, autoescape: false, loader: swig.loaders.fs(G.path.view)})
    swig.setDefaultTZOffset(8)
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', G.path.view + '/');
    app.set('view cache', false);
    //app.use(display());//display 封装
    //if (G.debug)app.use(logger('dev'));//开发环境性进行debug
    app.use(logger('dev'));//开发环境性进行debug
    app.use(bodyParser.json());//接受json 传输格式 restful 必备
    app.use(bodyParser.urlencoded({extended: true}));//传统url 传输方式
    app.use(cookieParser(G.cookie.secret));//cookie 使用注册
    //x-powered-by 操作
    //app.set('x-powered-by', 'xxx')
    app.disable('x-powered-by')


    //自定义路由
    if (fs.existsSync(G.path.config+'/route')){
        require(G.path.config+'/route')(app);
    }
    // 总路由
    require(G.path.core + '/core/route')(app);


    // catch 404 and forward to error handler
    app.use((req, res, next)=> {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // no stacktraces leaked to user
    app.use((err, req, res, next)=> {
        var err_msg = {}
        res.status(err.status || 500);
        if (G.debug) {
            err_msg = {
                message: err.message,
                error: err,
                status: err.status,
                code:-1
            }
        } else {
            err_msg = {
                message: err.message,
                status: err.status,
                code:-1
            }
        }
        //console.log(req.is('html'))
        //console.log(err_msg)
        res.json(err_msg)
        /*if(req.is('html')){
         req.display('/common/error',err_msg)
         }else{
         res.json(err_msg)
         }*/
    });

// 启动服务器
    /*var server = app.listen(G.port,()=>{
     console.log('ENode server listening on port ' + server.address().port);
     });*/

    return app

}
