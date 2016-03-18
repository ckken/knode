require('babel-core/register')
require(__dirname+'/framework/knode')({
    root_path:__dirname+'/application',
    mod:['module'],
    env:'test',
    port:8805
});