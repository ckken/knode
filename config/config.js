/**
 * Created by ken.xu on 14-2-10.
 */
module.exports=function(root){
    return {
        mongo:'mongodb://ken:666666@wvovo.com:27017/restful',
        model:root+'/model/',
        view:root+'/view/',
        controller:root+'/controller/',
        lib:root+'/lib/',
        maxAge: 259200000,
        secret:709394,
        port:6688
    }

}