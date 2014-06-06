var koa = require('koa'),
    app = koa(),
    path = require('path'),
    route = require('koa-route'),
    static = require('koa-static');

//var publicFiles = static(path.join(__dirname, 'public'));
//publicFiles._name = 'static /public';
//app.use(publicFiles);

app.use(static(path.join(__dirname, 'static')));

app.use(function *(){
    this.body = 'Hello World';
});

app.listen(3000);

console.log('listening on port 3000');
