# react-jira

## 项目目录

```js
│  .env  // 生产环境变量
│  .env.development  // 开发环境变量
│  .gitignore  // git 忽略文件
│  .prettierignore  // prettier忽略文件
│  .prettierrc.json  // prettier配置文件
│  commitlint.config.js  // commitlint配置文件
│  craco.config.js  // 修改antd默认配置
│  note.md  // 学习记录
│  README.md  // 项目描述
│  tsconfig.json  // ts配置文件
│
├─.husky
│
├─public
│      favicon.ico
│      index.html  // 主html文件
│      logo192.png
│      logo512.png
│      manifest.json  // PWA 移动APP配置文件，用于指定应用的显示名称、图标、入口页面等信息
│      mockServiceWorker.js  // Mock Service Worker
│      robots.txt  // 针对搜索引擎的配置
│
└─src
    │  App.css
    │  App.test.tsx
    │  App.tsx
    │  auth-provider.ts  // 登录、注册等认证封装
    │  authenticated-app.tsx  // 登录后的页面
    │  index.css
    │  index.tsx  // 入口文件
    │  logo.svg
    │  react-app-env.d.ts  // 引入提前定义好的类型声明文件
    │  reportWebVitals.ts  // 埋点上报
    │  require.ts  // 封装fetch请求
    │  setupTests.ts  // 配置单元测试
    │  wdyr.ts  // 配置前端性能监测插件Why Did You Render
    │
    ├─assets  // 静态文件
    │
    ├─components
    │      error-boundary.tsx  // 错误边界组件
    │      lib.tsx  // 公共组件
    │
    ├─context
    │      auth-context.tsx  // 用户信息与操作的context
    │      index.tsx  // APP全局context
    │
    ├─screens
    │  ├─epic  // 任务组
    |  |
    │  ├─kanban  // 任务看板
    |  |
    │  ├─project  // 项目详情
    |  |
    │  └─project-list  // 项目列表
    │
    ├─unauthenticated-app  // 未登录容器组件
    │      index.tsx
    │      login.tsx
    │      register.tsx
    │
    └─utils
            index.ts
            project.ts
            url.ts
            use-async.ts
            user.ts
```
