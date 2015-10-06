/**
 * Created by ken on 15/7/31.
 */
module.exports = {
    schema:true,
    attributes: {

        sid:{type:'integer',index:true,required:true}
        //,score:{type:'integer'}
        ,follow_user:{model:'wx_member'}
        ,own_user:{model:'wx_member'}
        ,follow_openid:{type:'string'}
        ,own_openid:{type:'string'}
        ,subscribe:{type:'integer',defaultsTo:1}

    }
}