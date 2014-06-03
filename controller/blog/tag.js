/**
 * Created by ken.xu on 14-2-11.
 */

module.exports = function(module,app,route,parse,render){

    app.use(route.get('/'+module, list));
    app.use(route.get('/'+module+'/add', add));
    app.use(route.get('/'+module+'/edit/:id', edit));
    app.use(route.get('/'+module+'/del/:id',del));
    app.use(route.post('/'+module+'/insert', insert));
    app.use(route.post('/'+module+'/update', update));

    function *list() {


        var page =  this.query.p||1;
        var perPage = this.query.perPage||10;
        var where = this.query.where||{};
        var bysort = this.query.sort||{
            '_id': -1
        }

        var count = yield function(fn){
            D(module).count(where, function(err, count) {
                if (err) return fn(err);
                fn(null, count);
            });
        }

        var List = yield function(fn){
            D(module).find(where).sort(bysort).skip((page - 1) * perPage).limit(perPage).lean().exec(function(err, doc) {
                var d = {};
                d.data = doc;
                d.count = count;
                d.page = F.page(page, count, perPage);
                d.data.forEach(function(vo){

                    vo.createtime= F.date.dgm(vo.createtime);
                })

                if (err) return fn(err);
                fn(null, d);
            })
        }

        this.body = yield render('tag/list',List);


    }

    function *add() {

/*        if(!G.user.id){
            this.body = yield F.msg('请登录后再发布','/auth/login');
            return ;
        }*/

        var ref = this.request.header.referer;
        if(G.user.status!=1){
            this.body = yield F.msg('无权限操作',ref);
            return ;
        }

        this.body = yield render('tag/add');
    }

    function *edit(id) {

/*        if(!G.user.id){
            this.body = yield F.msg('请登录后再发布','/auth/login');
            return ;
        }*/

        if(id!=''){

            var post = yield function(fn){
                D(module).findById(id,function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            if (!post) this.throw(404, '找不到相应关键字');
            this.body = yield render('tag/edit', { post: post});
        }else{
            this.redirect('/'+module);
        }

    }



    /**
     * Create a post.
     */

    function *insert() {
        var post = yield parse(this);
        if (!post.name) {

            this.body ="标题是必须的";
        }
        else if (!post.key) {

            this.body = "内容不能为空";
        }else{

            var cb = yield function(fn){
                D(module).insert(post, function (err, d) {
                    if(err)fn(err);
                    fn(null,d);
                })
            }

            G.tag = yield function(fn){
                D('tag').find({},function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }

            this.redirect('/'+module);
        }

    }

    function *update() {
        var post = yield parse(this);
        if(!post.id){
            this.body ="非法操作";
        }
        else if (!post.name) {

            this.body ="标题是必须的";
        }
        else if (!post.key) {

            this.body = "内容不能为空";
        }else{

            var cb = yield function(fn){
                D(module).findByIdAndUpdate(post.id,post, function (err, d) {
                    if(err)fn(err);
                    fn(null,d);
                })
            }


            G.tag = yield function(fn){
                D('tag').find({},function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }

            this.redirect('/'+module);
        }

        this.redirect('/'+module);
    }

    function *del(id){
        if(id!=''){
            var cb = yield function(fn){
                D(module).findByIdAndRemove(id,function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            this.redirect('/'+module);
        }else{
            this.body ="非法操作";
        }
    }

}