import lodash from 'lodash-node'
import fs from 'fs'
import moment from 'moment'
moment.locale('zh-cn')

//export default function (root, app_path, core_path) {
export default  (opt)=> {
    global._ = lodash
    _.moment = moment

    //根据当前文件生成
    if(!opt.app_path) {
        let filename = require.main.filename
        filename = filename.split('/')
        filename = filename[filename.length - 1].replace('.js', '')
        opt.app_path = filename
    }

    opt.app_path = opt.root_path+'/' + opt.app_path//应用模块路径
    opt.core_path = __dirname//框架路径

    //全局变量初始化
    require(opt.core_path + '/config/init')(opt)
    //控制层类初始化
    require(opt.core_path + '/controller/init')()
    //服务层类初始化
    require(opt.core_path + '/service/init')()
    //模型层初始化
    let db = function (cb) {
        cb()
    }
    if (G.db && G.db.connections && Object.keys(G.db.connections).length > 0) {
         db = require(opt.core_path + '/model/init')
    }
    //express 引入
    let app = require(opt.core_path + '/core/express')()
    //连接服务 socket io 等服务
    require(opt.core_path + '/core/connect')(app, db)
}