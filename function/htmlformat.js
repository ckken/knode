/**
 * Created by ken.xu on 14-2-10.
 */
module.exports = {
//delhtml
    delHtmlTag: function (str) {
        return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
    }
}
