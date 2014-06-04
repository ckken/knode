/**
 * Created by ken.xu on 14-2-10.
 */

module.exports = function(_CS,render,parse){


    return {
            _extend : 'blog/common',
            category : function *(){
                var map = {};
                map.tags = _CS.query.tag;
                var d = yield this._list(map);
                _CS.body = yield render('blog/list',d);
            },
            user : function *(){
                var map = {};
                map.author = _CS.query.uid;
                var d = yield this._list(map);
                _CS.body = yield render('blog/list',d);
            },
             _after_list :function(d,c){

                d.tag = (_CS.query.tag&&_CS.query.tag.length>0)?_CS.query.tag:'Knode博客';
                if(c=='user')d.tag = G.user.username+' 的博文';
                 return d;
            }
    }





}