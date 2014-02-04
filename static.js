var koa = require('koa');
var app = koa();

var path = require('path');
var static = require('koa-static');

//var publicFiles = static(path.join(__dirname, 'public'));
//publicFiles._name = 'static /public';
//app.use(publicFiles);

app.use(static(path.join(__dirname, 'public')));

app.listen(3000);

console.log('listening on port 3000');
