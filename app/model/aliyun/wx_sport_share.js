/**
 * Created by ken on 15/9/13.
 */
module.exports = {
    schema:true,
    attributes: {
        aid:{model:'wx_activity_sport_runner',required:true}
        ,sid:{type:'integer',index:true}
        ,shareType:{type:'string',required:true}
        ,share_user:{model:'wx_member'}
        ,own_user:{model:'wx_member'}

    }
}