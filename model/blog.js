module.exports = {

    type:function(Schema){
        return {
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
        }
    },
    validate:function(model,schema){
        /*schema.path('title').validate(function (v) {
            return v.length > 50;
        })*/
    }
}