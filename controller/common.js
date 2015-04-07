/**
 * Author: ken.xu
 * Date: 14-6-4 上午11:52
 */


/**
 *
 * @param _CS 全局 this
 * @param this.render 模版渲染函数
 * @param parse POST全局函数
 * @returns {*}
 */
module.exports = function(self) {

    //var ref = self.query.ref = self.request.header.referer || '/';

    return {
     /*   init: function * () {
            //:TODO 全局用户在线列表
            //if(!G.user){//当一个用户时 可以跨浏览器调用
            var user = self.cookies.get('member');
            G.user = user && JSON.parse(user) || {};
            //}
            //全局标签 包括导航栏
            if (!G.tag) G.tag = yield D('tag').find().exec();
            //权限认证
            this.auth();
        },*/





        _list: function * (map,_hooks) {

            var page = self.query.p || 1;
            var perPage = self.query.perPage || 10;
            map = map || {};
            var bysort = self.query.sort || {
                '_id': -1
            }

            var count = yield D(self.controller_name).count(map).exec();
            var list = yield D(self.controller_name).find(map).sort(bysort).skip((page - 1) * perPage).limit(perPage).lean().exec();
            var d = {};
            d.data = list;
            d.count = count;
            d.page = F.page(page, count, perPage);

            //完成SQL后执行钩子
            if ('undefined' !== typeof _hooks) {
                d = _hooks(self,d, self.controller_name);
            }
            return d;
            // self.body = yield this.render('blog/list',d);


        },

        msg:function (msg,url,title,second){
            msg = msg||'';
            url= url||'/';
            title=title||msg;
            second=second||2;
            return self.render('msg',{msg:msg,second:second,url:url,title:title});
        }


    }


}