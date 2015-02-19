/**
 * Created by ken.xu on 14-2-11.
 */
module.exports = function(_CS,render,parse){

    return {
        _extend : 'blog/common',
        login:function *(){

            if(G.user.username)this.redirect('/');
            _CS.body = yield render('auth/login');
        },
        register:function *(){
            if(G.user.username)_CS.redirect('/');
            _CS.body = yield render('auth/register');
        },
        forget:function *(){
            _CS.body = yield render('auth/forget');
        },
        tologin:function *(){
            var m = yield parse(_CS);
            var url = '/'+'auth/login'
            if(m.username=='')_CS.body = yield this.msg('用户账号不能为空',url);
            else if(m.password=='')_CS.body = yield this.msg('用户密码不能为空',url);
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
                    _CS.cookies.set('member', cookiemember);
                    _CS.body = yield this.msg('登陆成功','/');
                }
                else _CS.body = yield this.msg('账号或者密码错误，请重试',url);
            }
        },
        toregister:function *(){
            var m = yield parse(_CS);
            var url = '/'+'auth/register';
            if(m.username=='')_CS.body = yield this.msg('用户名称不能为空',url);
            else if(m.email=='')_CS.body = yield this.msg('用户邮箱不能为空',url);
            else if(m.password=='')_CS.body =yield this.msg('用户密码不能为空',url);
            else if(m.password!=m.checkpassword)_CS.body =yield this.msg('用户密码确认不正确',url);
            else{
                //
                var count = yield D('member').count({username: m.username}).exec();
                if(count>0)_CS.body = yield this.msg('已存在该用户',url);
                //
                count = yield D('member').count({email: m.email}).exec();
                if(count>0)_CS.body = yield this.msg('已存在该邮箱',url);
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
                    _CS.cookies.set('member', cookiemember);
                    _CS.body = yield this.msg('注册成功','/');
                }

                _CS.redirect('/');
            }

        },
        toforget:function *(){
            var m = yield parse(_CS);
        },

         logout:function *(){
            _CS.cookies.set('member', '');
            G.user={};
            _CS.redirect('/');
        }
    }


}