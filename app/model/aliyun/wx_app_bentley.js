/**
 * Created by ken on 15/8/5.
 */
module.exports = {
    schema:true,
    attributes: {
        sid:{type:'integer',index:true,required:true}
        ,shareType:{type:'string',required:true}
        ,share_user:{model:'wx_member'}
        ,own_user:{model:'wx_member'}

    }
}