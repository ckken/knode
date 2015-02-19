module.exports = function(root) {

    //依赖模块
    var koa = require('koa'),
        bodyParser = require('koa-bodyparser'),
        render = require('koa-swig'),
        static = require('koa-static'),
        path = require('path'),
        fs = require('fs')

    //  全局变量
    var ftjs ={}
    ftjs.root = __dirname
    ftjs.config = {}

    var app = koa();
    app.use(bodyParser());//post 方法
    app.use(static(path.join(root, 'static'), {maxage:ftjs.config.maxage||860000000}));//静态文件加载

    //模版选项
    render(app, {
        root: path.join(root, 'view'),
        autoescape: true,
        //cache: 'memory', // disable, set to false
        ext: 'html',
        //locals: locals,
        //filters: filters,
        //tags: tags,
        //extensions: extensions
    });

    //调试选项
    if(!ftjs.config.debug){
        var logger = require('koa-logger');
        app.use(logger());
    }  


    app.use(function *() {
        // the parsed body will store in this.request.body
       // this.response.status = 204;
        this.body = yield this.render('404');
    });

    //404页面
    app.use(function * pageNotFound(next) {
        console.log('404')
        this.body = yield this.render('404');
    });

    /**
     * 监听端口
     */
    ftjs.config.port = ftjs.config.port||8888
    app.listen(ftjs.config.port);
    console.log('listening on port ' +ftjs.config.port);

    /**
     * 错误处理
     */
    app.on('error', function(err) {
        console.log('server error', err);
    });



}