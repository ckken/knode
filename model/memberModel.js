var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var member = new Schema({
     username:String
	,password:String
	,email:String
	,regip:String
	,logip:String
    ,status:{type:Boolean,default:false}
    ,createtime:{type:String,default:F.date.time()}
	,logintime:{type:String,default:F.date.time()}
},{ collection: 'member'});

module.exports = mongoose.model('member', member);

