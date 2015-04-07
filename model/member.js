module.exports = {
    type:{
        username:String
        ,password:String
        ,email:String
        ,regip:String
        ,logip:String
        ,status:{type:Number,default:0}
        ,createtime:{type:Number,default:F.date.time()}
        ,logintime:{type:Number,default:F.date.time()}
    },
    validate:function(model,schema){

    }
}