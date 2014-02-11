/**
 * Created by ken.xu on 14-2-11.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tag = new Schema({
    name:String
    ,key:String
    ,createtime:{type:String,default:F.date.time()}
},{ collection: 'tag'});

module.exports = mongoose.model('tag', tag);