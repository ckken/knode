/**
 * Created by ken on 15/8/12.
 */
module.exports = {
    schema:true,
    attributes: {
        sid:{type:'integer',index:true,required:true}
        ,own_user:{model:'wx_member'}
        ,friend:{type:'integer',defaultsTo:0}
        ,timeline:{type:'integer',defaultsTo:0}
        ,score:{type:'integer',defaultsTo:0}

    }
}