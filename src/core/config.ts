import fs = require('fs');

export default (opt) => {

    //读取所有配置信息
    fs.readdirSync(opt.core_path + '/config').forEach((name) => {
        if (name.indexOf('.js') > -1 && name.indexOf('.js.map') === -1) {
            name = name.replace('.js', '')
            knode.config[name] = require(opt.core_path + '/config' + '/' + name).default || {}

        }
    })
}