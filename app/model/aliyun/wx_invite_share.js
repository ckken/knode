/**
 * Created by ken on 15/7/31.
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