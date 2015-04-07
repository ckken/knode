var ref = function(self){
    return self.request.header.referer || '/';
}

module.exports = {

    init:function * (next){
        var user = this.cookies.get('member');
        G.user = user && JSON.parse(user) || {};
        //}
        //全局标签 包括导航栏
        if (!G.tag) G.tag = yield D('tag').find().exec();
        //权限认证
        //crud权限
        var crudRule = ['add', 'edit', 'insert', 'update', 'del'];
        //console.log(F)
        if (this.controller_name=='blog'&&F.in_array(this.action_name, crudRule)) {
            if (!G.user.id) {
                self.body = yield this.blog.msg('请登录后再发布', '/auth/login');
                return;
            }
        }

        //超级管理员权限
        var superRule = ['tag'];

        if (F.in_array(this.controller_name, superRule)) {

            if (G.user.status != 1) {
                self.body = yield this.msg('无权限操作', ref(this));
                return;
            }
        }

        yield next

    }
}