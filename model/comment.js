module.exports = {
    type:function(Schema){
        return {
            aid      :Schema.Types.ObjectId
            , mod     :String
            , name    :String
            , email   :String
            , comment :String
            ,author   :{ type: Schema.Types.ObjectId, ref: 'member' }
            , date    :{type:Number,default: F.date.time()}
        }
    },
    validate:function(model,schema){

    }
}
