/**
 * Created by ken.xu on 14-2-10.
 */

module.exports = function(app,route,parse,render){

    app.use(route.get('/', list));
    app.use(route.get('/post/new', add));
    app.use(route.get('/post/edit/:id', edit));
    app.use(route.get('/post/:id', show));
    app.use(route.get('/post/del/:id',del));
    app.use(route.post('/post', create));
    app.use(route.post('/post/update', update));


    function *list() {


        var page =  this.query.p||1;
        var perPage = this.query.perPage||10;
        var where = this.query.where||{};
        var bysort = this.query.sort||{
            '_id': -1
        }

        var count = yield function(fn){
            D('blog').count(where, function(err, count) {
                if (err) return fn(err);
                fn(null, count);
            });
        }

        var List = yield function(fn){
            D('blog').find(where).sort(bysort).skip((page - 1) * perPage).limit(perPage).lean().exec(function(err, doc) {
                var d = {};
                d.data = doc;
                d.count = count;
                d.page = F.page(page, count, perPage);
                d.data.forEach(function(vo){

                    vo.content = F.html.delHtmlTag(vo.content);
                    vo.content = vo.content.substring(0, 250);
                })


                if (err) return fn(err);
                fn(null, d);
            })
        }

        this.body = yield render('blog/list',List);


    }

    function *add() {
        this.body = yield render('blog/new');
    }

    function *edit(id) {

        if(id!=''){

                var post = yield function(fn){
                    D('blog').findById(id,function(err,d){
                        if(err)fn(err);
                        fn(null,d);
                    })
                }
            if (!post) this.throw(404, '找不到相应文章');
            this.body = yield render('blog/edit', { post: post});
        }else{
            this.redirect('/');
        }

    }


    function *show(id) {

        if(id!=''){
            var post = yield function(fn){
                D('blog').findById(id,function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            if (!post) this.throw(404, '找不到相应文章');
            this.body = yield render('blog/show', { post: post });
        }else{
            this.redirect('/');
        }

    }

    /**
     * Create a post.
     */

    function *create() {
        var post = yield parse(this);
        if (!post.title) {

            this.body ="标题是必须的";
        }
        else if (!post.content) {

            this.body = "内容不能为空";
        }else{

            var cb = yield function(fn){
                D('blog').insert(post, function (err, d) {
                    if(err)fn(err);
                    fn(null,d);
                })
            }

            this.redirect('/');
        }

    }

    function *update() {
        var post = yield parse(this);
        if(!post.id){
            this.body ="非法操作";
        }
        else if (!post.title) {

            this.body ="标题是必须的";
        }
        else if (!post.content) {

            this.body = "内容不能为空";
        }else{

            var cb = yield function(fn){
                D('blog').findByIdAndUpdate(post.id,post, function (err, d) {
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            this.redirect('/');
        }

        this.redirect('/');
    }

    function *del(id){
        console.log(id);
        if(id!=''){
            var cb = yield function(fn){
                console.log(id);
                D('blog').findByIdAndRemove(id,function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            this.redirect('/');
        }else{
            this.body ="非法操作";
        }
    }

}