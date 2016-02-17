#KNode version 2.2 Beta

##安装依赖

+ express 
+ babel 
+ waterline	
+ momentJs  
+ lodash 

安装依赖  `npm install`  
运行程序  `node app.js`  

##项目逻辑层

+ app/controller 业务逻辑层  
+ app/config 配置文件  
+ app/model 数据模型  
+ app/service 服务层  
+ app/view 展现层  
+ app/socket websocket功能模块  

##下一步规划

+ websocket 支撑cluster  
+ mirco 微服务 分离引入  已经实现 <sup> version 2.2 </sup>
+ 引入jwt 鉴权  
+ 实现 restful模式 传统展示模式 websocket模式 等独立功能部署  <sup> version 2.2 </sup>
+ 同一个framework文件 多文件调用 实现多独立模块调用同一框架问题  <sup> version 2.2 </sup>
+ 完善开发文档
