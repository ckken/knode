/**
 * Author: ken.xu
 * Date: 14-6-4 下午3:30
 */
module.exports=function(root){
    return {
        //数据库连接
        mongo:'mongodb://acount:pwd@url:27017/db',
        //系统目录
        model:root+'/model/',
        view:root+'/view/',
        controller:root+'/controller/',
        lib:root+'/lib/',
        //cookie session
        maxAge: 259200000,
        secret:'*&$^*&(*&$%@#@#$@!#$@%((()*()^#$%$#%@#$%@#$%$#',
        //端口设置
        port:3388,
        //执行默认模块
        default_mod:['blog','blog','index'],
    }

}