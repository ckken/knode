//utils
import fs = require('fs');
import * as lodash from 'lodash-node'
//core module
import config from './core/config'
import express from './core/express'
import path = require('path')
//全局 promise 工具类 lodash
global.Promise = require('bluebird')
global._ = lodash
global.knode = {
    path: {},//所有项目路径
    controller: {},//控制层的类
    model: {},//模型类
    config: {},//配置路径
}
//初始化项目
export default class {
    constructor() {

    }

    run(opt: any) {
        opt.root_path = opt.root_path || path.dirname(__dirname);//程序根目录，默认文件夹根目录
        opt.core_path = opt.core_path || __dirname//框架路径

        //根据当前文件生成
        if (!opt.project_name) {
            let isWin = /^win/.test(process.platform);
            let filename = require.main.filename
            if (isWin) filename = filename.replace(/\\/g, "\/")
            filename = filename.split('/')
            opt.project_name = filename[filename.length - 1].replace('.js', '')
            opt.app_path = opt.root_path + '/'+filename
        }else{
            opt.app_path = opt.root_path + '/' + opt.project_name//应用模块路径
        }
        //全局路径
        knode.path = opt
        knode.config.port = opt.port||8888
        knode.config.env = opt.env
        //初始化所有模块
        config(opt)//配置文件赋值
        //express()//express 启动
    }


}

