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
        var _S = this;
        var page =  1;
        var perPage = 10;
        var pageList = '';
        var listData = {};
        console.log(1);
        listData = yield getlist();
        console.log(3);
        console.log(listData);
        this.body = yield render('blog/list',listData);


        function *getlist(){

            D('blog')._list({}, function (err, todos) {

                if (err) return next(err);

                todos.data.forEach(function (vo) {
                    vo.creattime = F.date.dgm(vo.creattime, 'yyyy-mm-dd');
                    vo.updatetime = F.date.dgm(vo.updatetime, 'yyyy-mm-dd');
                    if ('undefined' !== typeof vo.email)vo.avatar = F.encode.md5(vo.email);
                    if ('undefined' !== typeof vo.content) {
                        vo.content = F.html.delHtmlTag(vo.content);
                        vo.content = vo.content.substring(0, 250);
                    }
                })
                pageList = F.page(page, todos.count, perPage);
                console.log(2);

                return {
                    posts: todos,
                    page: pageList
                }


            });
        }

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