var mongoose = require('mongoose');
var member  = require('./memberModel');
var Schema = mongoose.Schema;
var comment = new Schema({
   aid      :Schema.Types.ObjectId
  , mod     :String
  , name    :String
  , email   :String
  , comment :String
  ,author   :{ type: Schema.Types.ObjectId, ref: 'member' }
  , date    :{type:Number,default: F.date.time()}
},{ collection: 'comment'});
module.exports = M.mongoose.model('comment', comment);
