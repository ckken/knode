var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var member = new Schema({
     username:String
	,password:String
	,email:String
	,regip:String
	,logip:String
    ,status:{type:Number,default:0}
    ,createtime:{type:Number,default:F.date.time()}
	,logintime:{type:Number,default:F.date.time()}
},{ collection: 'member'});

module.exports = mongoose.model('member', member);

