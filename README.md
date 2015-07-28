<img src="http://koa.wvovo.com/knode.gif">
=======================

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/ckken/koa-project?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

knode 基于nodejs koajs的下一代web框架解决方案 version 0.8.1 beta

项目功能展望讨论区: [https://github.com/ckken/koa-project/issues](https://github.com/ckken/koa-project/issues "项目讨论区")

============== 0.8.1====================
- 调整了model层的总体架构
- 调整controller 路由架构
- 删除 module 层
- ......

============== 0.6.8====================
- 调整了model层的总体架构
- 替换underscore 为 lodash
- 增加 koa-compose 进行流程处理
- 优化了mongoose 的调用方式

============== 0.6.1====================
- 减少了1/3的代码，优化了callback机制 重新认识yield的强大用法
- 以类的方式做继承 实现方法重用性
- 删除了CALLBACK代码 用yield 的方式完美解决callback的问题
- 核心包增加了 index.js
- 主模块入口 middleLoad.js
- 中间件入口 config.js 主配置文件
- function 移植到 knode里面 可以调用 F函数来增加自定义函数
- 本次优化增加了 Module / Controller / Action 3层


============== 0.5.1====================
- 删除了static模块 使用static cache代替
- 添加了LOG 配置方式在 knode 的首页 方便调试
- 兼容最新的 nodejs 0.11.12
- 优化了 cookies 的调用
- 修复了权限问题
- 修复了部分存在的BUG

============== 执行方法====================
- 执行方式: `node -harmony app`
- 将 config/config-default.js 改成 config.js
- 演示地址: [http://koa.wvovo.com/](http://koa.wvovo.com/ "DEMO")
## 文件以及作用：
- static.js 解决windows开发中遇到的问题以及解决方案
- yield.js 测试 异步流
- run.md 运行命令

============== 功能模块====================
- 管理员设置栏目功能
- 文章发布功能
- 评论功能
- 信息提示页面
- 多用户注册登录
- 权限控制模型
- 404页面
- 建立模块主入口
- bootstrap
- 缓存静态文件
- 修复官网附件，静态文件不会出现304的问题解决方法：
- 复制 koa-static-cache-index.js 文件在 koa-static-cache模块替换 index.js 文件即可
- 安全性模块（XSS + cookies验证）
- 增加 knode 文件夹作为文件夹核心部分，将进行分离核心代码到knode文件夹[**news**]2014/2/17 18:26:33








