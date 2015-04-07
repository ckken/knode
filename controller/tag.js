/**
 * Created by ken.xu on 14-2-11.
 */

var ref = function(self){
	return self.request.header.referer || '/';
}

module.exports =  {
	_access:['blog/init'],
	_extend:{blog:require('./common')},
	index: function * () {
		//console.log(this.blog)
		var d = yield this.blog._list(null);
		this.body = yield this.render('tag/list', d);
	},

	add: function * () {

		this.body = yield this.render(this.controller_name + '/add');
	},

	edit: function * () {
		var id = this.query.id;
		if (id != '') {
			var post = yield D(this.controller_name).findById(id).exec();
			if (!post) {
				this.body = yield this.blog.msg('找不到相应文章', ref(this));
			}
			if (post.author != G.user.id && G.user.status != 1) {
				this.body = yield this.blog.msg('无权限操作', ref(this));
				return;
			}
			this.body = yield this.render(this.controller_name + '/edit', {
				post: post
			});
		} else {
			this.redirect('/');
		}

	},

	/**
	 * del method
	 */
	del: function * () {
		var id = this.query.id;


		if (id != '') {

			var post = yield D(this.controller_name).findById(id).exec();
			if(!post){
				this.redirect('/')
				return
			}
			if (post.author != G.user.id && G.user.status != 1) {
				this.body = yield this.blog.msg('无权限操作', ref(this));
				return;
			}
			var cb = yield D(this.controller_name).remove({
				_id: id
			}).exec();

			this.body = yield this.blog.msg('删除成功', ref(this));

		} else {
			this.body = yield this.blog.msg('非法操作', ref(this));
		}
	},

	insert: function * () {
		var post = this.request.body
		/*if (!post.title) {

		 this.body = yield this.blog.msg('标题是必须的', ref(this));
		 } else if (!post.content) {
		 this.body = yield this.blog.msg('内容不能为空', ref(this));
		 } else {*/

		post.author = G.user.id;
		//var cb = yield D(this.controller_name).create(post);
		//cb.errors
		//console.log(cb);
		try{
			yield D(this.controller_name).create(post);
			this.redirect('/');
		}
		catch (err){
			this.body = yield this.blog.msg(JSON.stringify(err),null,100)
		}

		//}

	},

	update: function * () {


		var post = this.request.body
		if (!post.id) {
			this.body = yield this.blog.msg('非法操作', ref(this));
		} else {

			var cb = yield D(this.controller_name).findByIdAndUpdate(post.id, post).exec();

			this.body = yield this.blog.msg('更新成功', '/tag/index');

		}


	}

}