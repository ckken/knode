/**
 * Created by ken.xu on 14-2-10.
 */

module.exports = function(_CS, render, parse) {


    return {
        _extend: 'blog/common',
        category: function * () {
            var map = {};
            map.tags = _CS.query.tag;
            var d = yield this._list(map);
            _CS.body = yield render('blog/list', d);
        },
        user: function * () {
            var map = {};
            map.author = _CS.query.uid;
            var d = yield this._list(map);
            _CS.body = yield render('blog/list', d);
        },

        /**
         * page show
         */
        show: function * () {
            var id = _CS.query.id;

            if (id != '') {
                var post = yield D(R.c).findById(id).populate('author').exec();

                if (!post) {
                    _CS.body = yield this.msg('找不到相应文章', ref);
                } else {
                    post.updatetime = F.date.dgm(post.updatetime);
                    D(R.c).update({
                        _id: id
                    }, {
                        $inc: {
                            view: 1
                        }
                    }, function(err, d) {});
                    _CS.body = yield render('blog/show', {
                        post: post
                    });
                }

            } else {
                _CS.redirect('/');
            }
        },

        _after_list: function(d, c) {

            d.tag = (_CS.query.tag && _CS.query.tag.length > 0) ? _CS.query.tag : 'Knode博客';
            if (c == 'user') d.tag = G.user.username + ' 的博文';
            return d;
        }
    }





}