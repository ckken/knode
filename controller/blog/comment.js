/**
 * Author: ken.xu
 * Date: 14-6-4 下午4:54
 */
module.exports = function(_CS, render, parse) {


    return {
        _extend: ['blog/common'],
        index: function * () {


            var aid = _CS.query.aid || false;
            var mod = _CS.query.mod || false;

            if (aid && mod) {

                map = {
                    aid: aid,
                    mod: mod
                }

                var List = yield D('comment').find(map).populate('author').lean().exec();

                List.forEach(function(v) {
                    v.date = F.date.dgm(v.date);
                    if (v.author) {
                        v.author.avatar = F.encode.md5(v.author.email);
                        v.author.op = (v.author._id == G.user.id) ? 1 : 0;
                    }

                })
                _CS.body = List;
            } else {
                _CS.body = {
                    msg: '非法操作'
                };
            }
        },

        insert: function * () {

            var post = yield parse(_CS);

            var uid = G.user && G.user.id || '';
            if (uid == '') {
                _CS.body = {
                    msg: '请登录后再发布',
                    status: -1
                };
                return;
            }

            if (post.aid != '' && post.mod != '' && post.comment != '') {
                post.author = G.user.id;
                var cb = yield D('comment').create(post);
                _CS.body = {
                    msg: '评论成功',
                    status: 1
                };
            } else {
                _CS.body = {
                    msg: '评论失败',
                    status: 0
                };
            }

        },


        del: function * () {
            var post = yield parse(_CS);
            var uid = G.user && G.user.id || '';
            var uid = G.user.id || '';
            if (uid == '') {
                _CS.body = {
                    msg: '请登录后再删除',
                    status: -1
                };
                return;
            }
            var id = post.id;
            if (id) {
                var comment = yield D('comment').findById(id).exec()
                if (comment.author == G.user.id) {
                    var cb = yield D('comment').remove({_id: id}).exec()
                    _CS.body = {
                        msg: '删除成功',
                        status: 1
                    };
                } else {
                    _CS.body = {
                        msg: '删除失败',
                        status: -1
                    };
                }


            }
        }

    }
}