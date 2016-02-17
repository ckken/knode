require('babel-core/register')
require(__dirname+'/framework/knode')({
    root_path:__dirname,
    app_path:'app',
    port:8888
});