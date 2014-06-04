/**
 * Author: ken.xu
 * Date: 14-6-4 下午3:30
 */
module.exports=function(root){
    return {
        mongo:'mongodb://acount:pwd@url:27017/db',
        model:root+'/model/',
        view:root+'/view/',
        controller:root+'/controller/',
        lib:root+'/lib/',
        maxAge: 259200000,
        secret:'*&$^*&(*&$%@#@#$@!#$@%((()*()^#$%$#%@#$%@#$%$#',
        port:3388,
        default_mod:['blog','blog','index'],
    }

}