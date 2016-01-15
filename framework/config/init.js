import conf from './config'
import fs from 'fs'

export default function (root, app_path, core_path) {
    //定义全局配置方法 可以直接用 G. 调用
    global.G = conf(root, app_path, core_path)

    //创建项目目录
    if (!fs.existsSync(app_path))fs.mkdirSync(app_path)
    _.forEach(G.path, (v, k) => {
        if (!fs.existsSync(v) && v.indexOf(['app', 'core', 'root']) == -1)fs.mkdirSync(v)
    })

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

    //检查是否存在外部应用配置项 ./config
    fs.readdirSync(G.path.config).forEach((name)=> {
        if (name.indexOf('.js') > -1) {
            let conf = require(G.path.config + '/' + name)
            _.extend(G, conf);
        }
    })
}