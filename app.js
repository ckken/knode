require('babel-core/register')
require(__dirname+'/framework/knode')({
    root_path:__dirname+'/application',
    //extend_dir:['tmp','service','upload'],//通过这项配置 可以用 G.path.tmp ,G.path.service与G.service.load,G.path.upload 路径 并且生成对应目录
    //upload_path:'http://*******',带http头默认通过CDN上传 不生成目录 upload_path 一般都是放到共同的目录 或者通过 G.service.common_load 调用service 实现
    port:8888
});