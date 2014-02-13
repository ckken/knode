/**
 * Created by ken.xu on 14-2-13.
 */
module.exports = function(action,app,route,parse,render){

    app.use(route.get('/'+action, list));
    app.use(route.post('/'+action+'/insert', insert));
    app.use(route.post('/'+action+'/update', update));
    app.use(route.post('/'+action+'/del', del));

    function *list(){

        var aid =  this.query.aid||false;
        var mod =  this.query.mod||false;

        if(aid && mod){

            where = {
                aid:aid
                ,mod:mod
            }

            var List = yield function(fn){
                D(action).find(where).populate('author').lean().exec(function(err, d) {
                    d.forEach(function(v){
                        v.date = F.date.dgm(v.date),
                        v.author.avatar = F.encode.md5(v.author.email);
                        v.author.op = (v.author._id==G.user.id)?1:0;
                    })
                    if (err) return fn(err);
                    fn(null, d);
                })
            }

            this.body = List;
        }else{
            this.body = {msg:'非法操作'};
        }



    }

    function *insert(){


        var post = yield parse(this);
        if(!G.user.id){
            this.body = {msg:'请登录后再发布',status:-1};
            return;
        }

        if(post.aid!=''&&post.mod!=''&&post.comment!=''){
            post.author = G.user.id;
            var cb = yield function(fn){
                D(action).insert(post, function (err, d) {
                    if(err)fn(err);
                    fn(null,d);
                })
            }
            this.body = {msg:'发布成功',status:1};
        }else{
            this.body = {msg:'发布失败',status:0};
        }

    }

    function *update(){

    }

    function *del(){


        var post = yield parse(this);
        if(!G.user.id){
            this.body = {msg:'请登录后再删除',status:-1};
            return;
        }
        var id = post.id;
        if(id){

                var comment = yield function(fn){
                    D(action).findById(id,function(err,d){
                        if(err)fn(err);
                        fn(null,d);
                    })
                }
                if(comment.author==G.user.id){
                    var cb = yield function(fn){
                        D(action).remove({_id:id},function(err,d){
                            if(err)fn(err);
                            fn(null,d);
                        })
                    }
                    this.body = {msg:'删除成功',status:1};
                }else{
                    this.body = {msg:'删除失败',status:-1};
                }


        }




    }
}