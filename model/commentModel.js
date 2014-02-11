var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var comment = new Schema({
    _id     :Object
  , name    :String
  , email   :String
  , comment :String
  , date    :{type:String,default: F.date.time()}
},{ collection: 'comment'});
module.exports = M.mongoose.model('comment', comment);
