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

    return o;
}




module.exports = D;