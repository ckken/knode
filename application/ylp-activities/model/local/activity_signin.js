module.exports = {
    //schema:true,
    attributes: {
        name:{'type':'string',required:true}
        ,startTime:{'type':'date'}
        ,endTime:{'type':'date'}
        ,info:{'type':'string'}
        ,status:{type:'integer',defaultsTo:0}
        ,isRealName:{type:'Boolean',defaultsTo:false}
        ,isDanmu:{type:'Boolean',defaultsTo:true}
        ,redPackId:{type:'string',defaultsTo:''}

    }
}