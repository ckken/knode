/**
 * Created by ken.xu on 14-2-11.
 */
module.exports = function(action,app,route,parse,render){
    app.use(route.get('/'+action+'/login', login));
    app.use(route.get('/'+action+'/register', register));
    app.use(route.post('/'+action+'/tologin', tologin));
    app.use(route.post('/'+action+'/toregister', toregister));
    app.use(route.post('/'+action+'/forget', forget));

    function *login(){
        this.body = yield render(action+'/login');
    }
    function *register(){
        this.body = yield render(action+'/register');
    }
    function *forget(){
        this.body = yield render(action+'/forget');
    }
    function *tologin(){
        var post = yield parse(this);
        console.log(post);
    }
    function *toregister(){
        var post = yield parse(this);
        console.log(post);
    }
    function *toforget(){
        var post = yield parse(this);
        console.log(post);
    }


}