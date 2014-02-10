/**
 * Created by ken.xu on 14-2-10.
 */

module.exports = function(app,route,parse,render){

    var posts = [];

    // middleware

    // route middleware

    app.use(route.get('/', list));
    app.use(route.get('/post/new', add));
    app.use(route.get('/post/edit/:id', edit));
    app.use(route.get('/post/:id', show));

    app.use(route.post('/post', create));
    app.use(route.post('/post/update', update));
    // route definitions

    /**
     * Post listing.
     */

    function *list() {


        var page =  this.query.p||1;
        var perPage = this.query.perPage||2;
        var where = this.query.where||{};
        var bysort = this.query.sort||{
            '_id': -1
        };

        var count = yield function(fn){
            D('blog').count(where, function(err, count) {
                if (err) return fn(err);
                fn(null, count);
            });
        };

        var List = yield function(fn){
            D('blog').find(where).sort(bysort).skip((page - 1) * perPage).limit(perPage).lean().exec(function(err, doc) {
                var d = {};
                d.data = doc;
                d.count = count;
                d.page = F.page(page, count, perPage);
                if (err) return fn(err);
                fn(null, d);
            })
        };

        this.body = yield render('blog/list',List);


    }

    /**
     * Show creation form.
     */

    function *add() {
        this.body = yield render('blog/new');
    }

    function *edit(id) {
        console.log(id);
        console.log(id>=0&&posts.length>0);
        if(id>=0&&posts.length>0){
            var post = posts[id];
            this.body = yield render('blog/edit', { post: post});
        }else{
            this.redirect('/');
        }

    }

    /**
     * Show post :id.
     */

    function *show(id) {
        console.log(posts);
        var post = posts[id];
        if (!post) this.throw(404, 'invalid post id');
        this.body = yield render('blog/show', { post: post });
    }

    /**
     * Create a post.
     */

    function *create() {
        var post = yield parse(this);
        //var id = posts.push(post) - 1;
        //post.created_at = new Date;
        //post.id = id;
        console.log(post.content+'1');

        if (!post.title) {

            this.body ="标题是必须的";
        }
        else if (!post.content) {

            this.body = "内容不能为空";
        }else{
            yield insert(post);
            this.redirect('/');
        }

        function *insert(data){
            console.log(data);
            D('blog').insert(data, function (err, row) {
                return true;
            })
        }

    }

    function *update() {
        var post = yield parse(this);
        if(post.id>=0){

            post.created_at = new Date;
            posts[post.id]=post;
        }

        this.redirect('/');
    }

}