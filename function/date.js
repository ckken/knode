/**
 * Created by ken.xu on 14-1-27.
 */
module.exports = {

    time:function(datetime){

        var date = (datetime)?new Date(datetime):new Date();
        var time = Math.round(date.getTime()/1000);
        return time;
    },

    format: function (date, format) {
        date = new Date(parseInt(date) * 1000);

        var o = {
            "m+": date.getMonth() + 1, //month
            "d+": date.getDate(),    //day
            "h+": date.getHours(),   //hour
            "i+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
            "S": date.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    },

    dgm: function (date, format) {
        var timestr = parseInt(date);
        date = new Date(parseInt(date) * 1000);

        var o = {
            "m+": date.getMonth() + 1, //month
            "d+": date.getDate(),    //day
            "h+": date.getHours(),   //hour
            "i+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
            "S": date.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)if (new RegExp("(" + k + ")").test(format))format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));

        var now = new Date();
        now = now.getTime() / 1000;
        var time = now - date;
        var strtime = 0;
        var day = parseInt((now - timestr) / 86400);
        if (timestr == 0)format = '--';
        else if (timestr >= now) {
            if (time > 3600) {
                strtime = parseInt(time / 3600);
                format = strtime + ' 小时前';
            }
            else if (time > 1800) {
                format = '半小时前';
            } else if (time > 60) {
                strtime = parseInt(time / 60);
                format = strtime + ' 分钟前';
            } else if (time > 0) {
                format = strtime + ' 秒前';
            } else if (time == 0) {
                format = '刚刚';
            }
        }

        else if (day >= 0 && day < 7) {
            if (day == 0) {
                format = '昨天 ' + o['h+'] + ':' + o['i+'] + ':' + o['s+'] + '';
            } else if (day == 1) {
                format = '前天 ' + o['h+'] + ':' + o['i+'] + ':' + o['s+'] + '';
            } else {
                format = o['d+'] + ' 天前';
            }
        }

        return format;
    }
}