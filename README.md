#KNode version 2.3 Beta
#####基于 express babel 开发的 nodejs (传统刷新,restful,socket)模型的 立足微服务 开发框架！

安装依赖  `npm install`  
运行程序  `node app.js`  

##项目结构

+ app/module 传统页面模块  
+ app/config 配置文件  
+ app/model 数据模型  
+ app/service 服务层   
+ app/socket websocket功能模块  
+ app/api restful 模块

`微服务调用方式 可看app.js node app 可以开启多端口模式    `   

##数据库配置     
数据库ORM利用waterline 进行操作 配置如下:
微服务框架可以在公共模块如 `/application/common/config/db.js`里面 或者 
单服务里面 如 `app/config/db.js` 里面添加如下代码     
```javascript``` 
export default {
    db: {
        connections: {
            local: {
                adapter: 'mongo',
                host: '127.0.0.1',
                port: 27017,
                user: '',
                password: '',
                database: 'database'
            }
        }
    }
}

``````
## schema 配置成功后，启动服务，系统会自动生成对应得model/local 目录，然后增加schema 代码：
```javascript```

module.exports = {
    schema:true,
    attributes: {
        name:{'type':'string',required:true}
        ,startTime:{'type':'date'}
        ,endTime:{'type':'date'}
        ,info:{'type':'string'}
        ,status:{type:'integer',defaultsTo:0}

    }
}

``````

具体配置可以参考 waterline的用法，ORM调用方式为:
async await 方法: `await D.model('collectionName').find().toPromise()`      
回调方法: `D.model('collectionName').find().exec(function(error,data){})`     

## 实现功能以及规划<sup>(版本号为已经实现功能)</sup>

+ websocket 支撑cluster  
+ mirco 微服务 分离引入 <sup>2.2 </sup>
+ 引入jwt 鉴权  
+ 实现 restful模式 传统展示模式 websocket模式 等独立功能部署  <sup> version 2.2 </sup>
+ 同一个framework文件 多文件调用 实现多独立模块调用同一框架问题  <sup> version 2.2 </sup>
+ 完善开发文档

##独立进程设置方式<sup>2.3</sup>

``````
require('babel-core/register')//引入Babel 库
require(__dirname+'/framework/knode')({
    root_path:__dirname+'/application',//应用程序入口
    mod:['socket','api','module'],//启动socket 模式 api 模式 传统刷新页面模式 如果api 跟 module同时启动 api 路由为 /api/ 可以通过配置修改
    env:'production',//配置环境
    port:8888
});
``````

##pm2 支持<sup>2.3</sup>

``````
[
  {
    "script": "./ylp-activities.js",
    "name": "ylp-activities",
    "exec_mode": "fork",
  },
  {
    "script": "./ylp-analysis-mq.js",
    "name": "ylp-analysis-mq",
    "exec_mode": "fork",
  }
]
``````
## nginx 支持<sup>2.3</sup>

``````
server {
    listen 80;
    server_name domain.com;
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host  $http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_set_header Connection "";
        proxy_pass http://127.0.0.1:8888$request_uri;
        proxy_redirect off;

    }
}
``````
##activeMQ 支持<sup>2.3</sup>

``````
import Stomp from 'stompjs';
let client = Stomp.overTCP(G.mq.host, 61613)
    client.connect(G.mq.username, G.mq.password, async(d)=> {
        client.subscribe(G.mq_pay_queue, async(d)=> {
            let data = d&&JSON.parse(d.body)
        })
    }, (d)=> {
        return console.log('error')
    })
``````

##socket redis cluster `application/common/config/production/redis.js` 支持<sup>2.3</sup>
###

``````
export default {
    redis:{
        host:'localhost',
        username:'root',
        password:'password',
        port:'123'
    }
}


//socket 主动推送功能
import ioe from 'socket.io-emitter';
let emitter = ioe({ host: G.redis.host, port: G.redis.port })

 //通知客户端已经发布了
emitter.of('/payCount').emit('updateFromMq', true);
``````
