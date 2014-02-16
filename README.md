<img src="http://wvovo.com/koajs/knode.gif">
=======================
knode 基于nodejs koajs的下一代web框架解决方案 version 0.4.4  
执行方式: `node -harmony app`  
演示地址: [http://koa.wvovo.com/](http://koa.wvovo.com/ "DEMO")
## 文件以及作用： ##
static.js 解决windows开发中遇到的问题以及解决方案  
yield.js 测试 异步流  
run.md 运行命令  
## 实现功能 ##
管理员设置栏目功能  
文章发布功能  
评论功能  
信息提示页面
多用户注册登录  
权限控制模型 
404页面  
建立模块主入口  
bootstrap   
缓存静态文件
修复官网附件，静态文件不会出现304的问题解决方法：  
复制 koa-static-cache-index.js 文件在 koa-static-cache模块替换 index.js 文件即可  
安全性模块（XSS + cookies验证）  
## 官网依赖模块包括: ##
"koa": koa核心模块  
"koa-route":路由模块    
"koa-static":静态文件加载  
"koa-static-cache":静态文件缓存加载  
"co":异步流  
"co-fs": 文件流  
"co-body": post JSON模块  
"co-views": 视图模块  
"koa-compose":函数合并执行  
"swig": 模版引擎  
"xss":    方式xss 攻击    
"mongoose":mongo链接库    








