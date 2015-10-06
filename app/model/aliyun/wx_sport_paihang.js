/**
 * Created by ken on 15/9/13.
 */

module.exports = {
    schema:true,
    attributes: {
        aid:{model:'wx_activity_sport_runner',index:true,required:true}
        ,sid:{type:'integer',index:true}
        ,own_user:{model:'wx_member'}
        ,friend:{type:'integer',defaultsTo:0}
        ,timeline:{type:'integer',defaultsTo:0}
        ,follow:{type:'integer',defaultsTo:0}
        ,scan:{type:'integer',defaultsTo:0}
        ,score:{type:'integer',defaultsTo:0}

    }
}