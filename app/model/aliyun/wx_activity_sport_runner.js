module.exports = {
    schema:true,
    attributes: {
        wx:{model:'wx_account',required:true}
        ,name:{'type':'string',required:true}
        ,limit:{type:'integer',required:true}
        ,status:{type:'integer',defaultsTo:0}
        ,ruleUrl:{'type':'string'}
        ,endTime:{'type':'date'}


    }
}