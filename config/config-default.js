/**
 * Created by ken.xu on 14-2-10.
 */
module.exports=function(root){
    return {
        mongo:'mongodb://127.0.0.1:27017/koaDB',
        model:root+'/model/',
        view:root+'/view/',
        access:root+'/access/',
        controller:root+'/controller/',
        lib:root+'/lib/',
        maxAge: 259200000,
        secret:709394,
        port:6688,
        default_controller:'blog',
        default_action:'index',
    }

}