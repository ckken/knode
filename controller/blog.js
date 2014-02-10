/**
 * Created by ken.xu on 14-2-10.
 */

module.exports = function(app,route,parse){

    var posts = [];

    // middleware

    // route middleware

    app.use(route.get('/', list));
    app.use(route.get('/post/new', add));
    app.use(route.get('/post/:id', show));
    app.use(route.post('/post', create));

    // route definitions

    /**
     * Post listing.
     */

    function *list() {
        this.body = yield render('blog/list', { posts: posts });
    }

    /**
     * Show creation form.
     */

    function *add() {
        this.body = yield render('blog/new');
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
        var id = posts.push(post) - 1;
        post.created_at = new Date;
        post.id = id;
        this.redirect('/');
    }

}