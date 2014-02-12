/**
 * Created by ken.xu on 14-2-10.
 */
module.exports = {


    avatar:function(email,size){
        var a =  F.encode.md5(G.user.email);
        a = (size>0)?a+'?s='+size:a;
        return a;
    }
}
