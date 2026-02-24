# 学生教、学、评管理系统
基于 Node.js + Express + SQLite + Bootstrap 开发的轻量级教学管理系统，可直接部署在 Render 平台。

## 本地运行
1. 进入 backend 目录：`cd backend`
2. 安装依赖：`npm install`
3. 启动服务：`npm start`
4. 访问：http://localhost:3000

## Render 部署
1. 将代码上传到 GitHub 仓库
2. 登录 Render，创建 Web Service，关联该仓库
3. 配置：
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. 部署完成后，访问 Render 提供的域名即可。

## 默认账号
- 管理员账号：admin
- 密码：123456