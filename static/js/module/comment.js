/**
 * Created by ken.xu on 14-2-13.
 */
var comment = function(){
    var obj = $('#comment'),
        addObj = $('#addComment');

    var comarr = {
        aid : C.aid,
        mod : C.mod
    }

    var _S = this;

    this.list = function(){

        $.get('/comment',comarr,function(d){

            if(d){
                obj.html('');
                $.each(d,function(k,v){
                    var li = $('<li>').appendTo(obj),
                        div =$('<div>').attr('class','content').appendTo(li),
                        img_a = $('<img>').attr('src', 'https://0.gravatar.com/avatar/'+v.author.avatar+'?s=48').appendTo(div),
                        div_right = $('<div>').attr('class','div_right').appendTo(div),
                        p_a = $('<p>').attr('class','avatar').appendTo(div_right),
                        p_c = $('<p>').attr('class','commentContent').appendTo(div_right);
                    p_a.append('<span>'+v.author.username+'</span>'+'<span>'+v.date+'</span>');
                    //p_a.append('<a class="delbtn" rel="'+v._id+'">删除</a>');
                    if(v.author.op)p_a.append('<a class="btn btn-danger btn-xs" onclick=comment.del(\"'+v._id+'\")>删除</a>');
                    p_c.append(v.comment);
                })



            }else{

                obj.html('<li class="nocomment">等待您的沙发光临</li>');
            }


        })
    }


    this.edit = function(){

    }

    this.insert = function(){
        comarr.comment = addObj.val();
        if(comarr.comment!=''){
            $.post('/comment/insert',comarr,function(d){
                alert(d.msg);
                if(d.status){
                    _S.list();
                    addObj.val('');
                }

            })
        }else{
            alert('内容不能为空！');
        }

    }



    this.update = function(id){
        $.post('/comment/update',{id:id},function(d){
            _S.list();
        })
    }

    this.del = function(id){
        $.post('/comment/del',{id:id},function(d){
            alert(d.msg);
            if(d.status)_S.list();
        })
    }


}

comment = new comment();
comment.list();

$(function(){
    $('#submitbtn').click(function(){
        comment.insert();
    })
    $('.editbtn').click(function(){

    })
    console.log($('.delbtn'));

    $('.delbtn').bind('click',function(){
        var id = $(this).attr('rel');
        comment.del(id);
    })
})