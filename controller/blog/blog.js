/**
 * Created by ken.xu on 14-2-10.
 */

module.exports = function(module,app,route,parse,render){


    app.use(route.get('/', list));
    app.use(route.get('/'+module+'/add', add));
    app.use(route.get('/'+module+'/category/:tag', list));
    app.use(route.get('/'+module+'/user/:uid', list));
    app.use(route.get('/'+module+'/edit/:id', edit));
    app.use(route.get('/'+module+'/:id', show));
    app.use(route.get('/'+module+'/del/:id',del));
    app.use(route.post('/'+module+'', create));
    app.use(route.post('/'+module+'/update', update));



    function *list(tag) {
        var page =  this.query.p||1;
        var perPage = this.query.perPage||10;
        var where = this.query.where||{};
        var bysort = this.query.sort||{
            '_id': -1
        }

        var action = '';

        if(this.request.url.indexOf('category')>-1&&tag){
            where.tags = tag;
            action = 'category';
        }else if(this.request.url.indexOf('user')>-1&&tag){
            where.author = tag;
            action = 'user';
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

                d.tag = (tag&&tag.length>0)?tag:'Knode博客';
                if(action=='user')d.tag = G.user.username+' 的博文';

                if (err) return fn(err);
                fn(null, d);
            })
        }

        this.body = yield render('blog/list',List);


    }

    function *add() {
        if(!G.user.id){
            this.body = yield F.msg('请登录后再发布','/auth/login');
            return ;
        }
        this.body = yield render('blog/add');
    }

    function *edit(id) {
        var ref = this.request.header.referer;
        if(!G.user.id){
            this.body = yield F.msg('请登录后再发布','/auth/login');
            return ;
        }

        if(id!=''){

                var post = yield function(fn){
                    D(module).findById(id,function(err,d){
                        if(err)fn(err);
                        fn(null,d);
                    })
                }

            if (!post) {
                this.body = yield F.msg('找不到相应文章',ref);
            }

            if(post.author != G.user.id&&G.user.status!=1){
                this.body = yield F.msg('无权限操作',ref);
                return;
            }


            this.body = yield render('blog/edit', { post:post});
        }else{
            this.redirect('/');
        }

    }


    function *show(id) {
        var ref = this.request.header.referer;
        if(id!=''){
            var post = yield function(fn){
                D(module).findById(id).populate('author').exec(function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }

            if (!post){
                this.body = yield F.msg('找不到相应文章',ref);
            }

            post.updatetime= F.date.dgm(post.updatetime);
            D(module).update({_id:id},{$inc: {view: 1}}, function (err, d) {});
            this.body = yield render('blog/show', { post: post });
        }else{
            this.redirect('/');
        }

    }

    /**
     * Create a post.
     */

    function *create() {

        var ref = this.request.header.referer;
        if(!G.user.id){
            this.body = yield F.msg('请登录后再发布','/auth/login');
            return ;
        }
            var post = yield parse(this);
            if (!post.title) {

                //this.body ="标题是必须的";
                this.body = yield F.msg('标题是必须的',ref);
            }
            else if (!post.content) {

                //this.body = "内容不能为空";
                this.body = yield F.msg('内容不能为空',ref);
            }else{

                var cb = yield function(fn){
                    post.author = G.user.id;
                    D(module).insert(post, function (err, d) {
                        if(err)fn(err);
                        fn(null,d);
                    })
                }
                this.redirect('/');
            }

    }

    function *update() {

        var ref = this.request.header.referer;

        if(!G.user.id){
            this.body = yield F.msg('请登录后再发布','/auth/login');
            return ;
        }

        var post = yield parse(this);
        if(!post.id){
            //this.body ="非法操作";
            this.body = yield F.msg('非法操作',ref);
        }
        else if (!post.title) {

            //this.body ="标题是必须的";
            this.body = yield F.msg('标题是必须的',ref);
        }
        else if (!post.content) {

            //this.body = "内容不能为空";
            this.body = yield F.msg('内容不能为空',ref);
        }else{

            var blog = yield function(fn){
                D(module).findById(post.id,function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }

            if(blog.author != G.user.id&&G.user.status!=1){
                this.body = yield F.msg('无权限操作',ref);
                return;
            }

            var cb = yield function(fn){
                post.author = G.user.id;
                D(module).findByIdAndUpdate(post.id,post, function (err, d) {
                    if(err)fn(err);
                    fn(null,d);
                })
            }

            this.body = yield F.msg('更新成功','/blog/'+post.id);

        }


    }

    function *del(id){
        var ref = this.request.header.referer;
        if(!G.user.id){
            this.body = yield F.msg('请登录后进行操作','/auth/login');
            return ;
        }

        if(id!=''){

            var post = yield function(fn){
                D(module).findById(id,function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            if(post.author != G.user.id&&G.user.status!=1){
                this.body = yield F.msg('无权限操作',ref);
                return;
            }
                var cb = yield function(fn){
                    D(module).remove({_id:id},function(err,d){
                        if(err)fn(err);
                        fn(null,d);
                    })
                }
                //this.redirect('/');
                this.body = yield F.msg('删除成功',ref);


        }else{
            this.body = yield F.msg('非法操作',ref);
        }
    }

}