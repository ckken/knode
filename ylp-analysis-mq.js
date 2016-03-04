require('babel-core/register')
require(__dirname+'/framework/knode')({
    root_path:__dirname+'/application',
    mod:['socket','api'],
    env:'test',
    port:8804
});