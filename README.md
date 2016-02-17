#KNode version 2.2 Beta
###基于 express babel 开发的 nodejs (传统刷新,restful,socket)模型的 立足微服务 开发框架！

安装依赖  `npm install`  
运行程序  `node app.js`  

##项目结构

+ app/module 传统页面模块  
+ app/config 配置文件  
+ app/model 数据模型  
+ app/service 服务层   
+ app/socket websocket功能模块  
+ app/api restful 模块

## 微服务调用方式 可看app.js node app 可以开启多端口模式		

##数据库配置		
数据库ORM利用waterline 进行操作 配置如下	
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

## Version 2.+ 功能明细

+ websocket 支撑cluster  
+ mirco 微服务 分离引入  已经实现 <sup> version 2.2 </sup>
+ 引入jwt 鉴权  
+ 实现 restful模式 传统展示模式 websocket模式 等独立功能部署  <sup> version 2.2 </sup>
+ 同一个framework文件 多文件调用 实现多独立模块调用同一框架问题  <sup> version 2.2 </sup>
+ 完善开发文档
