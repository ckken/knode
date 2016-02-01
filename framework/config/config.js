export default (root, app, core)=> {
    return {
        //所有涉及到路径的问题放这里
        path: {
            controller: app + '/controller',
            api: app + '/api',
            config: app + '/config',
            model: app + '/model',
            view: app + '/view',
            service: app + '/service',
            tmp: app + '/runtime',
            root: root,
            app: app,
            core: core,
            upload: root + "/data"
        },
        //框架启动端口 是否在入口文件设置更加合理?
        port: 3311,
        rest: 'api',//restful api 的定位 避免传统接口冲突
        web: {
            module: 'home',//默认模块
            controller: 'index',//默认控制层
            action: 'index'//默认执行函数
        },
        cdn: '/static',
        cookie: {
            secret: '1234567890~!@',
            version: '0.01',//控制cookie 版本
        },
        socket: false
    }
}
