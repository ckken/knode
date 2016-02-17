import conf from './config'//系统默认配置变量
import fs from 'fs'

export default function (opt) {
    //定义全局配置方法 可以直接用 G. 调用
    global.G = conf(opt)
    //创建项目目录
    if (!fs.existsSync(opt.app_path))fs.mkdirSync(opt.app_path)
    /**
     * @G.system_mod Array 判断 生成对应的服务模式 api socket page , 默认值为[api,socket,page]
     */
    let module_folder = ['tmp','model','config']
    if(G.system_mod.indexOf('api')>-1){
        module_folder.push('api')
    }
    if(G.system_mod.indexOf('socket')>-1){
        module_folder.push('socket')
    }
    if(G.system_mod.indexOf('page')>-1){
        module_folder.push('controller')
        module_folder.push('view')
    }


    _.forEach(G.path, (v, k) => {
        if (!fs.existsSync(v) && module_folder.indexOf(k) > -1){
            fs.mkdirSync(v)
        }
    })
    //上传目录
    if(opt.upload_path){
        if('boolean' === typeof opt.upload_path){
            opt.upload_path = opt.app_path + "/data"
        }
        fs.mkdirSync(opt.upload_path)
    }

    //全局定位变量 page 模式
    if(G.system_mod.indexOf('page')>-1) {

        let default_app_path = [
            G.path.controller + '/' + G.web.module,
            G.path.view + '/' + G.web.module,
            G.path.view + '/' + G.web.module + '/' + G.web.controller
        ]
        _.forEach(default_app_path, (v, k) => {
            if (!fs.existsSync(v))fs.mkdirSync(v)
        })

        //创建文件
        let defaultJs = G.path.controller + '/' + G.web.module + '/' + G.web.controller + '.js'
        let defaultHtml = G.path.view + '/' + G.web.module + '/' + G.web.controller + '/' + G.web.action + '.html'
        if (!fs.existsSync(defaultJs)) {
            fs.createReadStream(G.path.core + '/controller/_default.js').pipe(fs.createWriteStream(defaultJs))
        }
        if (!fs.existsSync(defaultHtml)) {
            fs.createReadStream(G.path.core + '/view/_default.html').pipe(fs.createWriteStream(defaultHtml))
        }

    }

    //检查是否存在外部应用配置项 ./config
    fs.readdirSync(G.path.config).forEach((name)=> {
        if (name.indexOf('.js') > -1) {
            let conf = require(G.path.config + '/' + name)
            _.extend(G, conf);
        }
    })
}