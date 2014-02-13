/**
 * Created by ken.xu on 14-2-11.
 */
/**
 * Created by ken.xu on 14-2-10.
 */

module.exports = function(action,app,route,parse,render){

    app.use(route.get('/'+action, list));
    app.use(route.get('/'+action+'/add', add));
    app.use(route.get('/'+action+'/edit/:id', edit));
    app.use(route.get('/'+action+'/del/:id',del));
    app.use(route.post('/'+action+'/insert', insert));
    app.use(route.post('/'+action+'/update', update));

    function *list() {


        var page =  this.query.p||1;
        var perPage = this.query.perPage||10;
        var where = this.query.where||{};
        var bysort = this.query.sort||{
            '_id': -1
        }

        var count = yield function(fn){
            D(action).count(where, function(err, count) {
                if (err) return fn(err);
                fn(null, count);
            });
        }

        var List = yield function(fn){
            D(action).find(where).sort(bysort).skip((page - 1) * perPage).limit(perPage).lean().exec(function(err, doc) {
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
                D(action).findById(id,function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            if (!post) this.throw(404, '找不到相应关键字');
            this.body = yield render('tag/edit', { post: post});
        }else{
            this.redirect('/'+action);
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
                D(action).insert(post, function (err, d) {
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

            this.redirect('/'+action);
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
                D(action).findByIdAndUpdate(post.id,post, function (err, d) {
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

            this.redirect('/'+action);
        }

        this.redirect('/'+action);
    }

    function *del(id){
        if(id!=''){
            var cb = yield function(fn){
                D(action).findByIdAndRemove(id,function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            this.redirect('/'+action);
        }else{
            this.body ="非法操作";
        }
    }

}