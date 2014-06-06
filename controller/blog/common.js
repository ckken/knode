/**
 * Author: ken.xu
 * Date: 14-6-4 上午11:52
 */


/**
 *
 * @param _CS 全局 this
 * @param render 模版渲染函数
 * @param parse POST全局函数
 * @returns {*}
 */
module.exports = function(_CS, render, parse) {

    var ref = _CS.query.ref = _CS.request.header.referer || '/';

    return {

        init: function * () {
            //:TODO 全局用户在线列表
            //if(!G.user){//当一个用户时 可以跨浏览器调用
            var user = _CS.cookies.get('member');
            G.user = user && JSON.parse(user) || {};
            //}
            //全局标签 包括导航栏
            if (!G.tag) G.tag = yield D('tag').find().exec();
            //权限认证
            this.auth();
        },

        //:TODO 所有 权限认证 放到auth 类里面验证
        auth: function * () {
            //crud权限
            var crudRule = ['add', 'edit', 'insert', 'update', 'del'];

            if (F.inArray(R.a, crudRule)) {
                if (!G.user.id) {
                    _CS.body = yield this.msg('请登录后再发布', '/auth/auth/login');
                    return;
                }
            }

            //超级管理员权限
            var superRule = ['tag'];

            if (F.inArray(R.c, superRule)) {

                if (G.user.status != 1) {
                    _CS.body = yield this.msg('无权限操作', ref);
                    return;
                }
            }

        },



        index: function * () {
            var d = yield this._list();
            _CS.body = yield render('blog/list', d);
        },

        _list: function * (map) {

            var page = _CS.query.p || 1;
            var perPage = _CS.query.perPage || 10;
            map = map || {};
            var bysort = _CS.query.sort || {
                '_id': -1
            }


            var count = yield D(R.c).count(map).exec();
            var list = yield D(R.c).find(map).sort(bysort).skip((page - 1) * perPage).limit(perPage).lean().exec();
            var d = {};
            d.data = list;
            d.count = count;
            d.page = F.page(page, count, perPage);

            //完成SQL后执行钩子
            if ('undefined' !== typeof this._after_list) {
                d = this._after_list(d, R.c);
            }
            return d;
            // _CS.body = yield render('blog/list',d);


        },


        add: function * () {

            _CS.body = yield render(R.c + '/add');
        },

        edit: function * () {
            var id = _CS.query.id;
            if (id != '') {
                var post = yield D(R.c).findById(id).exec();
                if (!post) {
                    _CS.body = yield this.msg('找不到相应文章', ref);
                }
                if (post.author != G.user.id && G.user.status != 1) {
                    _CS.body = yield this.msg('无权限操作', ref);
                    return;
                }
                _CS.body = yield render(R.c + '/edit', {
                    post: post
                });
            } else {
                _CS.redirect('/');
            }

        },

        /**
         * del method
         */
        del: function * () {
            var id = _CS.query.id;


            if (id != '') {

                var post = yield D(R.c).findById(id).exec();

                if (post.author != G.user.id && G.user.status != 1) {
                    _CS.body = yield this.msg('无权限操作', ref);
                    return;
                }
                var cb = yield D(R.c).remove({
                    _id: id
                }).exec();

                _CS.body = yield this.msg('删除成功', ref);

            } else {
                _CS.body = yield this.msg('非法操作', ref);
            }
        },

        insert: function * () {
            var post = yield parse(_CS);
            /*if (!post.title) {

                _CS.body = yield this.msg('标题是必须的', ref);
            } else if (!post.content) {
                _CS.body = yield this.msg('内容不能为空', ref);
            } else {*/

                post.author = G.user.id;
                var cb = yield D(R.c).create(post);
                cb.errors
                console.log(cb);
                _CS.redirect('/');
            //}

        },

        update: function * () {


            var post = yield parse(_CS);
            if (!post.id) {
                _CS.body = yield this.msg('非法操作', ref);
            } else if (!post.title) {
                _CS.body = yield this.msg('标题是必须的', ref);
            } else if (!post.content) {

                //_CS.body = "内容不能为空";
                _CS.body = yield this.msg('内容不能为空', ref);
            } else {

                var blog = yield D(R.c).findById(post.id).exec();

                if (blog.author != G.user.id && G.user.status != 1) {
                    _CS.body = yield this.msg('无权限操作', ref);
                    return;
                }
                post.author = G.user.id;
                var cb = yield D(R.c).findByIdAndUpdate(post.id, post).exec();

                _CS.body = yield this.msg('更新成功', '/blog/blog/show/id/' + post.id);

            }


        },


    }


}