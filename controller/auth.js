/**
 * Created by ken.xu on 14-2-11.
 */
module.exports = function(module,app,route,parse,render){
    app.use(route.get('/'+module+'/login', login));
    app.use(route.get('/'+module+'/register', register));
    app.use(route.get('/'+module+'/forget', forget));
    app.use(route.get('/'+module+'/logout', logout));
    //
    app.use(route.post('/'+module+'/tologin', tologin));
    app.use(route.post('/'+module+'/toregister', toregister));
    app.use(route.post('/'+module+'/toforget', forget));

    /*app.use(route.get('/'+module+'/setAdmin/:id', setAdmin));

    function *setAdmin(id){
        if(id){
            var set = yield function(fn){
                D('member').findByIdAndUpdate(id,{status:1}, function (err, d) {
                    if(err)fn(err);
                    fn(null,d);
                })
                this.body = 'set by'+id;
            }
        }

    }*/

    function *login(){

        if(G.user.username)this.redirect('/');
        this.body = yield render(module+'/login');
    }
    function *register(){
        if(G.user.username)this.redirect('/');
        this.body = yield render(module+'/register');
    }
    function *forget(){
        this.body = yield render(module+'/forget');
    }
    function *tologin(){
        var m = yield parse(this);
        var url = '/'+module+'/login'
        if(m.username=='')this.body = yield F.msg('用户账号不能为空',url);
        else if(m.password=='')this.body = yield F.msg('用户密码不能为空',url);
        else{

            var where = {
                $or:[{username: m.username},{email:m.username}],
                password: m.password
            }

            var member = yield function(fn){
                D('member').findOne(where, function (err, d) {
                    if(err)fn(err);
                    fn(null,d);
                })
            }

            if(member){
                var cookiemember = {
                    id:member._id,
                    username:member.username,
                    email:member.email,
                    status:member.status
                }
                G.user = cookiemember;
                cookiemember = JSON.stringify(cookiemember);
                this.cookies.set('member', cookiemember,{ signed: true });
                this.body = yield F.msg('登陆成功','/');
            }
            else this.body = yield F.msg('账号或者密码错误，请重试',url);
        }
    }
    function *toregister(){
        var m = yield parse(this);
        var url = '/'+module+'/register';
        if(m.username=='')this.body = yield F.msg('用户名称不能为空',url);
        else if(m.email=='')this.body = yield F.msg('用户邮箱不能为空',url);
        else if(m.password=='')this.body =yield F.msg('用户密码不能为空',url);
        else if(m.password!=m.checkpassword)this.body =yield F.msg('用户密码确认不正确',url);
        else{
            var count = yield function(fn){
                D('member').count({username: m.username}, function (err, count) {
                    if(err)fn(err);
                    fn(null,count);
                })
            }
            if(count>0)this.body = yield F.msg('已存在该用户',url);
            count = yield function(fn){
                D('member').count({email: m.email}, function (err, count) {
                    if(err)fn(err);
                    fn(null,count);
                })
            }
            if(count>0)this.body = yield F.msg('已存在该邮箱',url);

            var member = yield function(fn){
                D('member').insert(m,function(err,d){
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            if(member){
                var cookiemember = {
                    id:member._id,
                    username:member.username,
                    email:member.email,
                    status:member.status,
                }
                G.user = cookiemember;
                cookiemember = JSON.stringify(cookiemember);
                this.cookies.set('member', cookiemember,{ signed: true });
                this.body = yield F.msg('注册成功','/');
            }

            this.redirect('/');
        }

    }
    function *toforget(){
        var m = yield parse(this);
    }

    function *logout(){
        this.cookies.set('member', '',{ signed: true });
        G.user={};
        this.redirect('/');
    }
}