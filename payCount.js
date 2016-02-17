require('babel-core/register')
require(__dirname+'/framework/knode')({
    root_path:__dirname,
    mod:['socket'],
    port:8889
});