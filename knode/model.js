module.exports = function(app,fs){

    var mongoose = require('mongoose');
    //定义 D 函数为 连接数据库
    mongoose.connect(C.mongo,{},function(err,res){
        if(err){

        }
    });
    var Schema = mongoose.Schema,
        models = {}


    if(C.debug.common&&C.debug.db){
        mongoose.set('debug', true);
    }

    D = function(name){
        return models[name]
    }

    fs.readdirSync(C.model).forEach(function (name) {
        var modelExt = '.js'
        if(name.indexOf(modelExt)>-1) {
            var model = require(C.model + name)
            name = name.replace(modelExt, '').toLowerCase()

            //mongoose
            var newSchema = new Schema(_.isFunction(model.type)&&model.type(Schema)||model.type, {collection: model.name||name});
            models[name] = mongoose.model(name, newSchema);
            //导入 model 与 Schema
            if (model.validate && _.isFunction(model.validate)) {
                model.validate(models[name],newSchema)
            }
        }

    })


}