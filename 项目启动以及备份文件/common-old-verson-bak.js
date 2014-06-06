/**
 * Author: Ken.xu
 * Date: 14-6-3 下午2:33
 */


module.exports = function (_CS,render) {


    //:TODO 利用动态类取代静态类的方法 目前yield 动态类方法没找到

    var cm = {

    init : function *(){

        //:TODO 全局用户在线列表
        //if(!G.user){//当一个用户时 可以跨浏览器调用
        var user = _CS.cookies.get('member');
        G.user = user && JSON.parse(user) || {};
        //}
        //全局标签
        if (!G.tag) G.tag = yield  D('tag').find().exec();
         //权限控制
         if (R.c=='tag') {
             var ref = _CS.request.header.referer;
             if (G.user.status != 1) {
             _CS.body = yield F.msg('无权限操作', ref);
             return;
             }
         }
        //全局变量定义

        R.q.ref = _CS.request.header.referer||'/';
        R.q.id = R.q.id||'';
     },



    index:function*(){
        yield cm._list();
    },

    _list :function *(tag){

        var page =  _CS.query.p||1;
        var perPage = _CS.query.perPage||10;
        var where = _CS.query.where||{};
        var bysort = _CS.query.sort||{
            '_id': -1
        }

        var action = '';

        if(_CS.request.url.indexOf('category')>-1&&tag){
            where.tags = tag;
            action = 'category';
        }else if(_CS.request.url.indexOf('user')>-1&&tag){
            where.author = tag;
            action = 'user';
        }


        var count = yield  D(R.c).count(where).exec();
        var list = yield  D(R.c).find(where).sort(bysort).skip((page - 1) * perPage).limit(perPage).lean().exec();
        var d = {};
        d.data = list;
        d.count = count;
        d.page = F.page(page, count, perPage);
        d.tag = (tag&&tag.length>0)?tag:'Knode博客';
        if(action=='user')d.tag = G.user.username+' 的博文';

        _CS.body = yield render('blog/list',d);


    },
    /**
     * page show
     */
    show:function *(){
        var id = R.q.id;
        var ref = R.q.ref;
        if(id!=''){
            var post = yield D(R.c).findById(id).populate('author').exec();

            if (!post){
                _CS.body = yield F.msg('找不到相应文章',ref);
            }else{
                post.updatetime= F.date.dgm(post.updatetime);
                D(R.c).update({_id:id},{$inc: {view: 1}}, function (err, d) {});
                _CS.body = yield render('blog/show', { post: post });
            }

        }else{
            _CS.redirect('/');
        }
    },

    add : function *(){
        if(!G.user.id){
            _CS.body = yield F.msg('请登录后再发布','/auth/login');
            return ;
        }
        _CS.body = yield render(R.c+'/add');
    },

    edit:function *() {
        var id = R.q.id;
        var ref = R.q.ref;

        if(!G.user.id){
            _CS.body = yield F.msg('请登录后再发布','/auth/login');
            return ;
        }

        if(id!=''){

            var post = yield D(module).findById(id).exec();

            if (!post) {
                _CS.body = yield F.msg('找不到相应文章',ref);
            }

            if(post.author != G.user.id&&G.user.status!=1){
                _CS.body = yield F.msg('无权限操作',ref);
                return;
            }
            _CS.body = yield render(R.c+'/edit', { post:post});
        }else{
            _CS.redirect('/');
        }

    },

    /**
     * del method
     */
    del :function *(){
        var id = R.q.id;
        var ref = R.q.ref;
        if(!G.user.id){
            _CS.body = yield F.msg('请登录后进行操作','/auth/login');
            return ;
        }

        if(id!=''){
            var post = yield D(module).findById(id).exec();
            if(post.author != G.user.id&&G.user.status!=1){
                _CS.body = yield F.msg('无权限操作',ref);
                return;
            }
            var cb = yield function(fn){
                D(module).remove({_id:id}).exec();
            }
            _CS.body = yield F.msg('删除成功',ref);

        }else{
            _CS.body = yield F.msg('非法操作',ref);
        }
    },

    /**
     * Create a post.
     */

    insert:function *() {

        var ref = R.q.ref;

        if(!G.user.id){
            _CS.body = yield F.msg('请登录后再发布','/auth/login');
            return ;
        }
        var post = yield parse(_CS);
        if (!post.title) {
            //_CS.body ="标题是必须的";
            _CS.body = yield F.msg('标题是必须的',ref);
        }
        else if (!post.content) {
            _CS.body = yield F.msg('内容不能为空',ref);
        }else{

            post.author = G.user.id;
            var cb = yield D(module).insert(post).exec();
            _CS.redirect('/');
        }

    },

    update:function *() {

        var ref = R.q.ref;

        if(!G.user.id){
            _CS.body = yield F.msg('请登录后再发布','/auth/login');
            return ;
        }

        var post = yield parse(_CS);
        if(!post.id){
            _CS.body = yield F.msg('非法操作',ref);
        }
        else if (!post.title) {
            _CS.body = yield F.msg('标题是必须的',ref);
        }
        else if (!post.content) {

            //_CS.body = "内容不能为空";
            _CS.body = yield F.msg('内容不能为空',ref);
        }else{

            var blog = yield D(module).findById(post.id).exec();

            if(blog.author != G.user.id&&G.user.status!=1){
                _CS.body = yield F.msg('无权限操作',ref);
                return;
            }

            var cb = yield function(fn){
                post.author = G.user.id;
                D(module).findByIdAndUpdate(post.id,post).exec();
            }

            _CS.body = yield F.msg('更新成功','/blog/'+post.id);

        }


    },


    }

    return cm;
}


