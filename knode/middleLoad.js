/**
 * Author: ken.xu
 * Date: 14-6-4 下午2:28
 */

module.exports = function(_CS,render,parse){

    //构造平台初始化抽象类
    var mi = {};
    mi.init = function *(){};
    /**
     * 全局信息回复
     * @param msg
     * @param url
     * @param title
     * @param second
     * @returns {*}
     */
    mi.msg =function (msg,url,title,second){
        msg = msg||'';
        url= url||'/';
        title=title||msg;
        second=second||2;
        return render('msg',{msg:msg,second:second,url:url,title:title});
    }

    //模块类
    var cm =  require(C.controller+R.m+'/'+R.c+'.js')(_CS,render,parse);
    //全局类
    var Ex = {};
    //:TODO 递归获取父级 直到获取最后一级为止
    cm._extend = cm._extend||'';
    if(cm._extend!=''){
        Ex = require(C.controller+'/'+cm._extend+'.js')(_CS,render,parse);
    }
    F.extend(mi,Ex);
    //跳过已有属性
    F.defaults(cm, mi);
    return cm;
}