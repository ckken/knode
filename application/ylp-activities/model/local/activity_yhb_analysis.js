module.exports = {
    schema:true,
    attributes: {
        aid:{type:'string',index:true,required:true}
        ,playTime:{type:'integer',defaultsTo:0}
        ,playMember:{type:'integer',defaultsTo:0}
        ,redpackNumber:{type:'integer',defaultsTo:0}
        ,leftNumber:{type:'integer',defaultsTo:0}
        ,shakeBol:{type:'boolean',defaultsTo:false}//是否开启游戏
    }
}