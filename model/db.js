var Schema = M.mongoose.Schema;
M.mongoose.set('debug', true);

models=new Array();
function D(obj) {
    var o = new Object;
    this.obj = obj;
    models[obj] = models[obj]||require(C.model + obj.toLocaleLowerCase() + 'Model');
    o = models[obj];

    o.insert = function(data, callback) {
        var d = new o(data);
        d.save(function(err) {
          callback(err,d);
        });
    }

    o._list = function(opt, callback) {
        var where = ('undefined' !== typeof opt.where) ? opt.where : {};
        var page = ('undefined' !== typeof opt.page) ? opt.page : 1;
        var perPage = ('undefined' !== typeof opt.perPage) ? opt.perPage : 10;
        var bysort = ('undefined' !== typeof opt.sort) ? opt.sort : {
            '_id': -1
        };
        o.count(where, function(err, count) {
            o.find(where).sort(bysort).skip((page - 1) * perPage).limit(perPage).lean().exec(function(err, doc) {
                var d = {};
                d.data = doc;
                d.count = count;
                callback(err, d);
            })
        });
    }

    o.delete = o.remove;

    return o;
}




module.exports = D;