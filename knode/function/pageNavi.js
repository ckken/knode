/**
 *
 * @param page 当前页数
 * @param count 总数
 * @param perpage 每页数量
 * @param json ： url , func ,attr
 * @returns {string}
 */
var pageNav = function (page, count, perpage,json) {

    var default_json = {
        url:'',//是否连接
        func:'',//是否执行函数
        attr:'',//attr的样式
        act:'on',//激活样式
        info:1,//介绍当前页数情况
        pernext:1,//上下页
        w:10//出血位 单数
    };
    json = $.extend(default_json,json);
    page = parseInt(page);
    page = (page > 0) ? page : 1;
    var rowNum = Math.ceil(count / perpage);
    var pageFomat = "<ul class='pagination pagination-sm'>{$pageList} {$pageInfo}</ul>";
    var pageList = '';
    var surl, i,o;
    var pageInfo = "<li><a>" + count + "条记录 " + page + "/" + rowNum + " 页</a></li>";
    var href = function (i){

        if(json.func){
            surl = 'onclick='+json.url+'('+i+')';
        }else if(json.url){
            surl = (json.url) ? json.url : '?p=';
            surl = 'href='+ surl + i;
        }
        else if(json.attr){
            surl = json.attr+'='+i;
        }
        return surl;
    }

    if (rowNum < json.w) {

        for (i = 1; i <= rowNum; i++) {
            if (i == page) {
                pageList += "<li class="+json.act+"><a "+href(i)+">" + i + "</a></li>";
            } else {
                pageList += "<li><a "+href(i)+">" + i + "</a></li>";
            }
        }
    }
    else {
        if (page < json.w) {
            for (i = 1; i <= json.w; i++) {
                if (i == page) {
                    pageList += "<li class="+json.act+"><a "+href(i)+">" + i + "</a></li>";
                } else {
                    pageList += "<li><a "+href(i)+">" + i + "</a></li>";
                }
            }
        }
        else if (page >= (rowNum - (json.w-1))) {
            //pageList += "<li><a "+href(1)+">1</a><i>...</i></li>";

            for (i = (rowNum - (json.w-1)); i <= rowNum; i++) {
                if (i == page) {
                    pageList += "<li class="+json.act+"><a "+href(i)+">" + i + "</a></li>";
                } else {
                    pageList += "<li><a "+href(i)+">" + i + "</a></li>";
                }
            }
        }
        else {
           // pageList += "<li><a "+href(1)+">1</a><i>...</i></li>";
            o = Math.floor(json.w/2);
            for (i = (page - o); i <= (page + o); i++) {
                if (i == page) {
                    pageList += "<li class="+json.act+"><a "+href(i)+">" + i + "</a></li>";
                } else {
                    pageList += "<li><a "+href(i)+">" + i + "</a></li>";
                }
            }
        }
    }

    if(json.pernext){
        if(page !=1){
            pageList = "<li><a "+href(page-1)+">《</a></li>"+pageList;
        }
        if(page!=rowNum){
            pageList = pageList+"<li><a "+href(page+1)+">》</a></li>";
        }
    }

    pageFomat = pageFomat.replace('{$pageList}', pageList);
    pageFomat = (json.info)?pageFomat.replace('{$pageInfo}', pageInfo):pageFomat.replace('{$pageInfo}', '');

    return pageFomat;
}
