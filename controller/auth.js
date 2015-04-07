/**
 * Created by ken.xu on 14-2-11.
 */
module.exports = {
        _extend:{blog:require('./common')},
        login:function *(){

            if(G.user.username)this.redirect('/');
            this.body = yield this.render('auth/login');
        },
        register:function *(){
            if(G.user.username)this.redirect('/');
            this.body = yield this.render('auth/register');
        },
        forget:function *(){
            this.body = yield this.render('auth/forget');
        },
        tologin:function *(){
            var m = this.request.body
            var url = '/auth/login'
            if(m.username=='')this.body = yield this.blog.msg('用户账号不能为空',url);
            else if(m.password=='')this.body = yield this.blog.msg('用户密码不能为空',url);
            else{

                var where = {
                    $or:[{username: m.username},{email:m.username}],
                    password: m.password
                }

                var member = yield D('member').findOne(where).exec();

                if(member){
                    var cookiemember = {
                        id:member._id,
                        username:member.username,
                        email:member.email,
                        status:member.status
                    }
                    G.user = cookiemember;
                    cookiemember = JSON.stringify(cookiemember);
                    this.cookies.set('member', cookiemember);
                    this.body = yield this.blog.msg('登陆成功','/');
                }
                else this.body = yield this.blog.msg('账号或者密码错误，请重试',url);
            }
        },
        toregister:function *(){
            var m = this.request.body;
            var url = '/'+'auth/register';
            if(m.username=='')this.body = yield this.blog.msg('用户名称不能为空',url);
            else if(m.email=='')this.body = yield this.blog.msg('用户邮箱不能为空',url);
            else if(m.password=='')this.body =yield this.blog.msg('用户密码不能为空',url);
            else if(m.password!=m.checkpassword)this.body =yield this.blog.msg('用户密码确认不正确',url);
            else{
                //
                var count = yield D('member').count({username: m.username}).exec();
                if(count>0)this.body = yield this.blog.msg('已存在该用户',url);
                //
                count = yield D('member').count({email: m.email}).exec();
                if(count>0)this.body = yield this.blog.msg('已存在该邮箱',url);
                //
                var member = yield D('member').create(m);

                if(member){
                    var cookiemember = {
                        id:member._id,
                        username:member.username,
                        email:member.email,
                        status:member.status,
                    }
                    G.user = cookiemember;
                    cookiemember = JSON.stringify(cookiemember);
                    this.cookies.set('member', cookiemember);
                    this.body = yield this.blog.msg('注册成功','/');
                }

                this.redirect('/');
            }

        },
        toforget:function *(){
            var m = this.request.body;
        },

         logout:function *(){
            this.cookies.set('member', '');
            G.user={};
            this.redirect('/');
        }
    }


