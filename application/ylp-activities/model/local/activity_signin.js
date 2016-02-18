module.exports = {
    //schema:true,
    attributes: {
        name:{'type':'string',required:true}
        ,startTime:{'type':'date'}
        ,endTime:{'type':'date'}
        ,info:{'type':'string'}
        ,status:{type:'integer',defaultsTo:0}

    }
}