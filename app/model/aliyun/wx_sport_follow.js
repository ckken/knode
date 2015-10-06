/**
 * Created by ken on 15/9/16.
 */
module.exports = {
    schema:true,
    attributes: {
        aid:{model:'wx_activity_sport_runner',required:true}
        ,sid:{type:'integer',index:true}
        ,follow_user:{model:'wx_member'}
        ,own_user:{model:'wx_member'}

    }
}