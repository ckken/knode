export default (opt)=> {
    return {
        //所有涉及到路径的问题放这里
        path: {
            module: opt.app_path + '/module',
            api: opt.app_path + '/api',
            config: opt.app_path + '/config',
            model: opt.app_path + '/model',
            service: opt.service_path||opt.app_path + '/service',
            tmp: opt.tmp_path||opt.app_path + '/runtime',
            socket: opt.app_path + '/socket',
            root: opt.root_path,
            app: opt.app_path,
            core: opt.core_path,
            upload: opt.upload_path||opt.root_path + "/upload"
        },
        //框架启动端口 是否在入口文件设置更加合理?
        port: opt.port||3311,
        rest: 'api',//restful api 的定位 避免传统接口冲突
        system_mod:opt.mod||['api','socket','module'],//api 为restful 模式 module 为传统模式 socket 为websocket 模式
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
