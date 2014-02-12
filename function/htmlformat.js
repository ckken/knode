/**
 * Created by ken.xu on 14-2-10.
 */
module.exports = {
//delhtml
    delHtmlTag: function (str) {
        return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
    },

    subhtml:function(str,num,begin){
        num = num||200;
        begin = begin||0;
        str = this.delHtmlTag(str);
        return str.substring(begin, num);
    }
}
