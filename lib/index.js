"use strict";
var lodash = require('lodash-node');
//core module
var config_1 = require('./core/config');
var path = require('path');
//全局 promise 工具类 lodash
global.Promise = require('bluebird');
global._ = lodash;
global.knode = {
    path: {},
    controller: {},
    model: {},
    config: {},
};
//初始化项目
var default_1 = (function () {
    function default_1() {
    }
    default_1.prototype.run = function (opt) {
        opt.root_path = opt.root_path || path.dirname(__dirname); //程序根目录，默认文件夹根目录
        opt.core_path = opt.core_path || __dirname; //框架路径
        //根据当前文件生成
        if (!opt.project_name) {
            var isWin = /^win/.test(process.platform);
            var filename = require.main.filename;
            if (isWin)
                filename = filename.replace(/\\/g, "\/");
            filename = filename.split('/');
            opt.project_name = filename[filename.length - 1].replace('.js', '');
            opt.app_path = opt.root_path + '/' + filename;
        }
        else {
            opt.app_path = opt.root_path + '/' + opt.project_name; //应用模块路径
        }
        //全局路径
        knode.path = opt;
        knode.config.port = opt.port || 8888;
        knode.config.env = opt.env;
        //初始化所有模块
        config_1.default(opt); //配置文件赋值
        //express()//express 启动
    };
    return default_1;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=index.js.map