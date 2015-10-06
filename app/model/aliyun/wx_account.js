/**
 * Created by ken on 15/7/26.
 */
var md5 = require('md5')
var encode_type = 'vcoscripet'
module.exports = {
    schema:true,
    attributes: {
        name:{type:'string'}
        ,appid:{type:'string',required:true,unique:true}
        ,secret:{type:'string',required:true}
        ,encodingAESKey:{type:'string'}
        ,server_token:{type:'string'}
        //,uid:String
        //,uid:{ type: Schema.Types.ObjectId, ref: 'member' }
        ,status:{type:'integer',defaultsTo:0,max:10}
        //,create_time:{type:'date'}
        //,update_time:{type:'date'}
        ,sid:{type:'integer',index:true}
        ,app:{type:'json'}
    },

    beforeCreate: function (values, cb) {
        var date = new Date()
        //values.create_time = date
        //values.update_time = date
        var rand = parseInt(Math.random()*1000)
        values.server_token = md5(date.getTime().toString()+encode_type+rand)
         this.count(function(err,d){
             values.sid = d+1
             cb();
         })

    },
    beforeUpdate: function (values, cb) {
        //values.create_time = new Date()
       // values.update_time = new Date()
        cb();
    },
    afterValidate: function (values, cb) {
       // console.log(values)
        cb();
    },
}