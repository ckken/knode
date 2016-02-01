/**
 * Created by ken on 15/7/25.
 */
import fs from 'fs'
import waterline from 'waterline'
import mongoAdapter from 'sails-mongo'
//import diskAdapter from 'sails-disk'
import mysqlAdapter from 'sails-mysql'
import sqlServerAdapter from 'sails-sqlserver'

export default function (cb) {

    //链接数据库 创建全局数据模型变量
    global.D = {}
    let orm = new waterline()
    let dbs = {}
    let config = {
        adapters: {
            'default': mongoAdapter,
            mongo: mongoAdapter,
            //disk: diskAdapter,
            mysql: mysqlAdapter,
            sqlserver:sqlServerAdapter,
        },
        connections: {},
        defaults: {
            migrate: 'safe'
           // migrate: 'alter'
        }
    }
    //初始化数据库配置
    _.extend(config, G.db)
    _.forEach(config.connections, (v, k) => {
        //不存在数据库 模型目录 创建
        if (!fs.existsSync(G.path.model + '/' + k))fs.mkdirSync(G.path.model + '/' + k)
        //获取所有模型进行初始化
        fs.readdirSync(G.path.model + '/' + k).forEach((name)=> {
            if (name.indexOf('.js') > -1) {
                name = name.replace('.js', '').toLowerCase()
                //tableName
                var setting = require(G.path.model + '/' + k + '/' + name)
                setting.connection = setting.connection || k;//连接数据库的名称 别名
                setting.tableName = setting.tableName || name;//数据表名称
                //setting.identity = k
                setting.autoCreatedAt = setting.autoCreatedAt || true;//自动记录增加时间
                setting.autoUpdatedAt = setting.autoUpdatedAt || true;//自动记录修改时间
                dbs[k] = waterline.Collection.extend(setting)

                orm.loadCollection(dbs[k])
            }

        })
    })



    orm.initialize(config, (err, models) => {
        if (err) throw err;
        console.log('数据库连接成功')
        D.model = function (model_name) {
            return models.collections[model_name]
        }
        D.connections = function () {
            return models.connections
        }
        //::TODO 加入判断信息
        /*_.forEach(models.collections, function (v, k) {
         _hook_validate(v)
         })*/
        cb()
    })

    //::TODO 重写 validate 函数 加入 中文检验方式
    var _hook_validate = function (model) {
        var sailsValidate = model.validate

        function validate(values, presentOnly, callback) {
            sailsValidate
                .call(model, values, presentOnly, error => {

                    if (error) {

                        if (error.ValidationError) {
                            //error.Errors = error.ValidationError
                            _validateCustom(model, error.ValidationError);
                        }
                        callback(error);
                    } else {
                        callback(null);
                    }
                })
        }

        model.validate = validate
    }
    //::TODO 导入 错误信息提示
    var _validateCustom = function (model, validationError) {

        _.forEach(validationError, (v, k) => {
            _.forEach(v, (vo, ko)=> {
                vo.message = model._attributes[k] && model._attributes[k][vo.rule] || vo.message
            })
        })
    }
}