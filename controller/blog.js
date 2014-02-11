/**
 * Created by ken.xu on 14-2-10.
 */

module.exports = function(action,app,route,parse,render){

    app.use(route.get('/', list));
    app.use(route.get('/'+action+'/add', add));
    app.use(route.get('/'+action+'/category/:tag', list));
    app.use(route.get('/'+action+'/edit/:id', edit));
    app.use(route.get('/'+action+'/:id', show));
    app.use(route.get('/'+action+'/del/:id',del));
    app.use(route.post('/'+action+'', create));
    app.use(route.post('/'+action+'/update', update));



    function *list(tag) {
        var page =  this.query.p||1;
        var perPage = this.query.perPage||10;
        var where = this.query.where||{};
        var bysort = this.query.sort||{
            '_id': -1
        }

        if(tag)where.tags = tag;

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

                    vo.content = F.html.delHtmlTag(vo.content);
                    vo.content = vo.content.substring(0, 250);
                    vo.updatetime= F.date.dgm(vo.updatetime);

                })


                if (err) return fn(err);
                fn(null, d);
            })
        }

        this.body = yield render('blog/list',List);


    }

    function *add() {

        this.body = yield render('blog/add');
    }

    function *edit(id) {

        if(id!=''){

                var post = yield function(fn){
                    D(action).findById(id,function(err,d){
                        if(err)fn(err);
                        fn(null,d);
                    })
                }
            if (!post) this.throw(404, '找不到相应文章');
            this.body = yield render('blog/edit', { post:post});
        }else{
            this.redirect('/');
        }

    }


    function *show(id) {

        if(id!=''){
            var post = yield function(fn){
                D(action).findById(id,function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            if (!post) this.throw(404, '找不到相应文章');
            post.updatetime= F.date.dgm(post.updatetime);
            D(action).findByIdAndUpdate(id,{$inc: {view: 1}}, function (err, d) {});
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

                D(action).insert(post, function (err, d) {
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
                D(action).findByIdAndUpdate(post.id,post, function (err, d) {
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            this.redirect('/');
        }

        this.redirect('/');
    }

    function *del(id){

        if(id!=''){
            var cb = yield function(fn){
                D(action).findByIdAndRemove(id,function(err,d){
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