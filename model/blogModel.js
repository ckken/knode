var mongoose = require('mongoose');
var member  = require('./memberModel');
var Schema = mongoose.Schema;
var blog = new Schema({
    title:String
    ,content:String
    ,pic:String
    ,ip:String
    ,tags:[]
    ,status:{type:Number,default:0}
    ,creattime:{type:Number,default:F.date.time()}
    ,updatetime:{type:Number,default:F.date.time()}
    ,email:String
    ,author:{ type: Schema.Types.ObjectId, ref: 'member' }
    ,view:{type:Number,default:0}
    , meta      : {
            votes : {type:Number,default:0}
          , favs  : {type:Number,default:0}
        }
},{ collection: 'blog'});
module.exports = M.mongoose.model('blog', blog);
