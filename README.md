# Kami. (Compatible Plan)

> [!WARNING]  
> 仅有兼容计划，不会有任何新功能，仅仅是为了保持 Kami 的运行。会出现代码质量低下等问题。
> 
> **更推荐使用 [Shiro](https://github.com/Innei/Shiro) 以获得更好的体验。**

<sup>如果你发现了 Kami 与 Core 的不兼容问题，请提交 issue 并描述具体问题，团队成员会尽快修复。</sup>

---

> [!WARNING]  
> Next.js 14 已发布，Kami 即日起停止维护，请使用 [Shiro](https://github.com/Innei/Shiro) 以获得更好的体验。

[![wakatime](https://wakatime.com/badge/github/mx-space/kami.svg)](https://wakatime.com/badge/github/mx-space/kami)

**Kami is Sunsetting**, check here to read [more](#kami-is-sunsetting).

> [!IMPORTANT]  
> Next.js 13 低版本中存在内存泄露问题，在 [issue](https://github.com/vercel/next.js/issues/49929) 中，该 issue 表示已修复，但是由于 Node.js < 18.17.0 中可能存在漏内存问题，你也需要升级 Node.js 来解决这个问题。

小小空间，大大梦想。

Small space, big dream.

---

Kami 是一个为 Mix Space 打造的主站前端。完美覆盖全部功能。

**🌟 核心特性 / Core Features**

- ✅ **完全适配支持 Mix Space Core v8.6.0** / **Fully compatible with Mix Space Core v8.6.0**
- ⚡ **Next.js 16.1.1 重大升级** / **Next.js 16.1.1 major upgrade**
- 🛡️ **全面的错误处理和测试覆盖** / **Comprehensive error handling and test coverage**
- 🚀 **性能优化：缓存、重试、去重** / **Performance optimization: caching, retry, deduplication**

Live Demo:

- <https://dev.innei.ren>
- <https://www.timochan.cn/>
- <https://www.suemor.com/>
- <https://www.miaoer.xyz/>

点击下面按钮，立即部署到 Vercel！

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmx-space%2Fkami&env=NEXT_PUBLIC_API_URL,NEXT_PUBLIC_GATEWAY_URL&envDescription=API%20%E5%9C%B0%E5%9D%80%E5%92%8C%E7%BD%91%E5%85%B3%E5%9C%B0%E5%9D%80&project-name=kami-web)

![](https://user-images.githubusercontent.com/41265413/169677737-9b407450-ec95-4d30-b5ca-818cf1d18bdb.png)
![](https://github.com/mx-space/docs-images/blob/master/images/bg.jpg?raw=true)

---

## 📚 目录 / Table of Contents

- [项目结构说明](#-项目结构说明)
- [API 说明](#-api-说明)
- [开发说明](#-开发说明)
- [使用说明](#-使用说明)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [Markdown 扩展语法](#-markdown-扩展语法)
- [迁移到 Kami v3](#-migration-to-kami-v3)
- [注意事项](#-notice)
- [许可证](#-license)

---

## 📁 项目结构说明

### 根目录结构

```
kami/
├── .github/                  # GitHub Actions 工作流配置
│   └── workflows/
│       ├── build.yml         # 构建工作流
│       ├── comment-pr.yml     # PR 评论工作流
│       ├── docker.yml         # Docker 部署工作流
│       ├── nextjs_bundle_analysis.yml  # Bundle 分析工作流
│       └── release.yml        # 发布工作流
├── .husky/                   # Git Hooks 配置
│   ├── post-checkout         # Checkout 后钩子
│   ├── post-commit           # 提交后钩子
│   ├── post-merge            # 合并后钩子
│   ├── pre-commit            # 提交前钩子
│   └── pre-push              # 推送前钩子
├── cypress/                  # E2E 测试配置
│   ├── e2e/
│   │   └── core.cy.ts        # 核心功能测试
│   └── support/
│       └── e2e.ts            # 测试支持文件
├── public/                   # 静态资源目录
│   ├── assets/
│   │   ├── images/           # 图片资源
│   │   └── new-style/        # 新样式图片
│   ├── favicon.ico           # 网站图标
│   ├── favicon.svg           # SVG 网站图标
│   ├── logo.png              # Logo 图片
│   └── robots.txt            # 爬虫配置
├── scripts/                  # 脚本工具目录
│   ├── api-compare/          # API 对比工具
│   ├── perf/                 # 性能测试工具
│   ├── visual-regression/    # 视觉回归测试工具
│   ├── create-tags.sh        # 标签创建脚本
│   ├── fetch-build.mjs       # 构建获取脚本
│   ├── generate-default-configs.js  # 默认配置生成器
│   ├── start-prod.mjs        # 生产环境启动脚本
│   └── update-cdn.sh         # CDN 更新脚本
├── src/                      # 源代码目录
├── tests/                    # 测试文件目录
│   ├── visual/               # 视觉测试
│   │   ├── actual/           # 实际截图
│   │   ├── baseline/         # 基准截图
│   │   └── diff/             # 差异截图
├── third/                    # 第三方库目录
│   └── qp/                   # QP 组件库
├── .commitgpt-template       # Commit 模板
├── .commitgpt.json           # Commit 配置
├── .dockerignore             # Docker 忽略文件
├── .env.example              # 环境变量示例
├── .gitignore                # Git 忽略文件
├── .npmrc                    # npm 配置
├── .prettierignore           # Prettier 忽略文件
├── .prettierrc.js            # Prettier 配置
├── .stylelintrc              # Stylelint 配置
├── CHANGELOG                 # 变更日志
├── Dockerfile                # Docker 配置
├── LICENSE                   # 许可证
├── README.md                 # 项目说明文档
├── build.sh                  # 构建脚本
├── config.example.yaml       # 配置示例文件
├── config.init.yaml          # 初始配置文件
├── cypress.config.ts         # Cypress 配置
├── ecosystem.config.js       # PM2 配置
├── ecosystem.standalone.config.js  # PM2 独立配置
├── eslint.config.mjs         # ESLint 配置
├── next-env.d.ts             # Next.js 类型定义
├── next.config.mjs           # Next.js 配置
├── nodemon.json              # Nodemon 配置
├── package.json              # 项目依赖配置
├── pnpm-lock.yaml            # pnpm 锁文件
├── postcss.config.js         # PostCSS 配置
├── react.d.ts                # React 类型定义
├── renovate.json             # Renovate 配置
├── sentry.client.config.ts   # Sentry 客户端配置
├── sentry.edge.config.ts     # Sentry Edge 配置
├── sentry.server.config.ts   # Sentry 服务端配置
├── standalone-build.sh       # 独立构建脚本
├── tsconfig.json             # TypeScript 配置
├── tsconfig.server.json      # TypeScript 服务端配置
├── types.d.ts                # 类型定义
└── windi.config.ts           # WindiCSS 配置
```

### 源代码结构 (src/)

```
src/
├── assets/                   # 资源文件
│   └── styles/
│       ├── extra.css         # 额外样式
│       ├── main.css          # 主样式
│       ├── mono.css          # 单色样式
│       ├── shizuku.css       # Shizuku 样式
│       ├── theme.css         # 主题样式
│       └── variables.css     # CSS 变量
├── atoms/                    # 状态管理 (Zustand)
│   ├── collections/          # 集合状态
│   │   ├── utils/
│   │   │   └── base.ts       # 基础工具
│   │   ├── comment.ts        # 评论状态
│   │   ├── note.ts           # 手记状态
│   │   ├── page.ts           # 页面状态
│   │   ├── post.ts           # 文章状态
│   │   ├── project.ts        # 项目状态
│   │   └── say.ts            # 说说状态
│   ├── types/
│   │   └── index.ts          # 类型定义
│   ├── action.ts             # 动作状态
│   ├── app.ts                # 应用状态
│   ├── dev.ts                # 开发状态
│   ├── music.ts              # 音乐状态
│   ├── network.ts            # 网络状态
│   └── user.ts               # 用户状态
├── components/               # 组件目录
│   ├── app/                   # 应用级组件
│   │   ├── ClientOnly/        # 客户端渲染组件
│   │   ├── Composer/         # 组合器组件
│   │   ├── Error/            # 错误组件
│   │   ├── ErrorBoundary/    # 错误边界组件
│   │   ├── HoC/              # 高阶组件
│   │   ├── If/               # 条件渲染组件
│   │   ├── Meta/             # 元数据组件
│   │   ├── NetworkLoadingBridge/  # 网络加载桥接组件
│   │   ├── Seo/              # SEO 组件
│   │   ├── Style/            # 样式组件
│   │   ├── Suspense/         # 悬停组件
│   │   └── WrapperNextPage/  # Next.js 页面包装器
│   ├── common/               # 通用组件
│   │   ├── AckRead/          # 确认阅读组件
│   │   ├── CodeBlock/        # 代码块组件
│   │   ├── IconTransition/   # 图标过渡组件
│   │   ├── ImpressionView/   # 印象视图组件
│   │   ├── KamiMarkdown/     # Markdown 渲染组件
│   │   ├── Logo/             # Logo 组件
│   │   ├── Mermaid/          # Mermaid 图表组件
│   │   └── RelativeTime/     # 相对时间组件
│   ├── in-page/              # 页面级组件
│   │   ├── Friend/           # 友链组件
│   │   ├── Home/             # 首页组件
│   │   ├── Note/             # 手记组件
│   │   ├── Post/             # 文章组件
│   │   ├── Project/          # 项目组件
│   │   ├── Recently/         # 最近动态组件
│   │   ├── SectionMusic/     # 音乐区块组件
│   │   └── Timeline/         # 时间线组件
│   ├── layouts/              # 布局组件
│   │   ├── ArticleLayout/    # 文章布局
│   │   ├── SiteLayout/       # 站点布局
│   │   ├── AppLayout.tsx     # 应用布局
│   │   ├── DebugLayout.tsx   # 调试布局
│   │   └── NoteLayout.tsx    # 手记布局
│   ├── ui/                   # UI 组件
│   │   ├── AnimateChangeInHeight/  # 高度动画组件
│   │   ├── Avatar/           # 头像组件
│   │   ├── Banner/           # 横幅组件
│   │   ├── Button/           # 按钮组件
│   │   ├── Collapse/         # 折叠组件
│   │   ├── Divider/          # 分割线组件
│   │   ├── FlexText/         # 弹性文本组件
│   │   ├── FloatPopover/     # 浮动弹出框组件
│   │   ├── FontIcon/         # 字体图标组件
│   │   ├── Icons/            # 图标集合
│   │   ├── Image/            # 图片组件
│   │   ├── ImageTagPreview/  # 图片标签预览组件
│   │   ├── Input/            # 输入框组件
│   │   ├── Lazyload/         # 懒加载组件
│   │   ├── LikeButton/       # 点赞按钮组件
│   │   ├── Loading/          # 加载组件
│   │   ├── Markdown/         # Markdown 组件
│   │   ├── Modal/            # 模态框组件
│   │   ├── Notice/           # 通知组件
│   │   ├── NumberRecorder/   # 数字记录器组件
│   │   ├── Overlay/          # 遮罩层组件
│   │   ├── Pagination/       # 分页组件
│   │   ├── Portal/           # 传送门组件
│   │   ├── SliderImagesPopup/  # 图片轮播弹出框组件
│   │   ├── Tag/              # 标签组件
│   │   └── Transition/       # 过渡动画组件
│   └── widgets/              # 小组件
│       ├── ArticleAction/    # 文章操作组件
│       ├── CodeHighlighter/  # 代码高亮组件
│       ├── Comment/          # 评论组件
│       ├── Copyright/        # 版权组件
│       ├── Donate/           # 捐赠组件
│       ├── LampSwitch/       # 灯光开关组件
│       ├── Loader/           # 加载器组件
│       ├── Player/           # 播放器组件
│       ├── Search/           # 搜索组件
│       ├── Subscribe/        # 订阅组件
│       ├── SubscribeBell/    # 订阅铃铛组件
│       ├── Toast/            # 提示组件
│       ├── Toc/              # 目录组件
│       ├── xLogInfo/         # xLog 信息组件
│       └── xLogSummary/      # xLog 摘要组件
├── constants/                # 常量定义
│   ├── env.ts                # 环境变量常量
│   ├── kaomoji.ts            # 颜文字常量
│   ├── meta-icon.ts          # 元数据图标常量
│   ├── spring.ts             # Spring 动画常量
│   └── tracker.ts            # 追踪器常量
├── hooks/                    # React Hooks
│   ├── app/                  # 应用级 Hooks
│   │   ├── use-ack-read-count.ts      # 确认阅读计数
│   │   ├── use-analyze.ts             # 分析统计
│   │   ├── use-check-logged.ts        # 检查登录状态
│   │   ├── use-check-old-browser.ts   # 检查旧浏览器
│   │   ├── use-header-meta.ts         # 头部元数据
│   │   ├── use-header-nav-list.ts     # 头部导航列表
│   │   ├── use-initial-data.ts       # 初始数据
│   │   ├── use-jump-to-render.ts      # 跳转渲染
│   │   ├── use-kami-theme.tsx         # Kami 主题
│   │   ├── use-music.ts               # 音乐播放
│   │   ├── use-resize-scroll-event.ts # 调整滚动事件
│   │   └── use-router-event.ts        # 路由事件
│   ├── common/               # 通用 Hooks
│   │   ├── use-click-away.ts          # 点击外部
│   │   ├── use-debounce-value.ts      # 防抖值
│   │   ├── use-is-client.ts           # 是否客户端
│   │   ├── use-is-mounted.ts          # 是否已挂载
│   │   ├── use-is-unmounted.ts        # 是否已卸载
│   │   ├── use-once-client-effect.ts  # 一次性客户端效果
│   │   ├── use-safe-setState.ts       # 安全 setState
│   │   ├── use-single-double-click.ts # 单双击
│   │   ├── use-state-ref.ts           # 状态引用
│   │   └── use-sync-effect.ts         # 同步效果
│   └── ui/                   # UI Hooks
│       ├── use-dark-mode-detector.ts  # 暗色模式检测
│       ├── use-dark.ts                # 暗色模式
│       ├── use-load-serif-font.ts      # 加载衬线字体
│       ├── use-screen-media.ts         # 屏幕媒体
│       └── use-viewport.ts            # 视口
├── pages/                    # Next.js 页面
│   ├── [page]/               # 动态页面
│   │   └── index.tsx         # 页面索引
│   ├── api/                  # API 路由
│   │   ├── feed/
│   │   │   └── index.tsx     # RSS Feed
│   │   └── sitemap/
│   │       └── index.tsx     # 站点地图
│   ├── categories/          # 分类页面
│   │   └── [slug].tsx        # 分类详情
│   ├── favorite/             # 收藏页面
│   │   ├── bangumi.tsx       # 追番页面
│   │   └── music.tsx         # 音乐页面
│   ├── friends/              # 友链页面
│   │   └── index.tsx         # 友链列表
│   ├── login/                # 登录页面
│   │   └── index.tsx         # 登录表单
│   ├── notes/                # 手记页面
│   │   ├── topics/           # 主题页面
│   │   │   ├── [topicSlug].tsx  # 主题详情
│   │   │   └── index.tsx     # 主题列表
│   │   ├── [id].tsx          # 手记详情
│   │   └── index.tsx         # 手记列表
│   ├── posts/                # 文章页面
│   │   ├── [category]/       # 分类文章
│   │   │   └── [slug].tsx    # 文章详情
│   │   └── index.tsx         # 文章列表
│   ├── preview/              # 预览页面
│   │   └── index.tsx         # 预览
│   ├── projects/             # 项目页面
│   │   ├── [id].tsx          # 项目详情
│   │   └── index.tsx         # 项目列表
│   ├── recently/             # 最近动态
│   │   └── index.tsx         # 动态列表
│   ├── register/             # 注册页面
│   │   └── index.tsx         # 注册表单
│   ├── says/                 # 说说页面
│   │   └── index.tsx         # 说说列表
│   ├── timeline/             # 时间线页面
│   │   └── index.tsx         # 时间线
│   ├── 404.tsx               # 404 页面
│   ├── _app.tsx              # 应用入口
│   ├── _document.tsx         # 文档入口
│   ├── _error.tsx            # 错误页面
│   └── index.tsx             # 首页
├── provider/                 # Context Provider
│   ├── index.ts              # Provider 索引
│   ├── initial-data.tsx      # 初始数据 Provider
│   ├── swr.tsx               # SWR Provider
│   └── toastify.tsx          # Toastify Provider
├── socket/                   # WebSocket 连接
│   ├── handler.ts            # 事件处理器
│   ├── index.ts              # Socket 索引
│   └── socket-client.ts      # Socket 客户端
├── types/                    # 类型定义
│   ├── config.ts             # 配置类型
│   ├── events.ts             # 事件类型
│   ├── key.ts                # 键类型
│   └── xlog.ts               # xLog 类型
├── utils/                    # 工具函数
│   ├── request/              # 请求工具
│   │   ├── cache.ts          # 请求缓存
│   │   └── retry.ts          # 请求重试
│   ├── _.ts                  # Lodash 工具
│   ├── app.ts                # 应用工具
│   ├── client.ts             # API 客户端
│   ├── color.ts              # 颜色工具
│   ├── console.ts            # 控制台工具
│   ├── cookie.ts             # Cookie 工具
│   ├── danmaku.ts            # 弹幕工具
│   ├── dom.ts                # DOM 工具
│   ├── env.ts                # 环境工具
│   ├── event-emitter.ts      # 事件发射器
│   ├── images.ts             # 图片工具
│   ├── load-script.ts        # 脚本加载
│   ├── logger.ts             # 日志工具
│   ├── markdown.ts           # Markdown 工具
│   ├── notice.ts             # 通知工具
│   ├── spring.ts             # Spring 动画
│   ├── time.ts               # 时间工具
│   ├── url.ts                # URL 工具
│   ├── utils.ts              # 通用工具
│   └── word.ts               # 文字工具
└── configs.default.ts        # 默认配置
```

### 核心文件说明

| 文件路径 | 功能描述 | 依赖关系 |
|---------|---------|---------|
| `src/pages/_app.tsx` | Next.js 应用入口，配置全局组件和 Provider | 依赖 `src/provider/` 下的所有 Provider |
| `src/pages/_document.tsx` | Next.js 文档入口，配置 HTML 结构 | 依赖全局样式和字体 |
| `src/utils/client.ts` | API 客户端配置，封装 Axios 请求 | 依赖 `@mx-space/api-client`、`axios`、`zustand` |
| `src/atoms/app.ts` | 应用全局状态管理 | 依赖 `zustand`、`apiClient` |
| `src/atoms/network.ts` | 网络请求状态管理 | 依赖 `zustand` |
| `src/socket/socket-client.ts` | WebSocket 客户端 | 依赖 `socket.io-client` |
| `src/utils/logger.ts` | 统一日志记录 | 依赖 `Sentry` |
| `src/utils/request/cache.ts` | 请求缓存机制 | 依赖 `MemoryCache` |
| `src/utils/request/retry.ts` | 请求重试机制 | 依赖指数退避算法 |

---

## 🔌 API 说明

### API 客户端配置

Kami 使用 `@mx-space/api-client` 作为 API 客户端，通过自定义 Axios 适配器实现请求拦截、缓存、重试等功能。

#### 基础配置

```typescript
// src/utils/client.ts
const $axios: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})
```

#### 请求拦截器

- **功能**: 自动添加 Authorization Token 和 UUID
- **实现**: 在请求头中添加 `Authorization` 和 `x-uuid`
- **触发时机**: 每次请求前

#### 响应拦截器

- **功能**: 处理错误、重试机制、网络状态管理
- **错误处理**:
  - 401: 登录已过期或未授权
  - 408: 请求超时
  - 500+: 服务暂时不可用
- **重试机制**: 指数退避算法，最多重试 3 次

### API 路由

#### 1. RSS Feed API

**路径**: `/api/feed`

**方法**: `GET`

**功能**: 生成 RSS/Atom Feed

**参数**: 无

**返回值格式**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>站点标题</title>
  <link href="/atom.xml" rel="self"/>
  <link href="/feed" rel="self"/>
  <link href="站点URL"/>
  <updated>更新时间</updated>
  <id>站点ID</id>
  <author>
    <name>作者名称</name>
  </author>
  <generator>Mix Space CMS</generator>
  <lastBuildDate>构建日期</lastBuildDate>
  <language>zh-CN</language>
  <image>
    <url>头像URL</url>
    <title>站点标题</title>
    <link>站点URL</link>
  </image>
  <entry>
    <title>文章标题</title>
    <link href='文章链接'/>
    <id>文章ID</id>
    <published>发布时间</published>
    <updated>更新时间</updated>
    <content type='html'><![CDATA[文章内容]]></content>
  </entry>
</feed>
```

**错误处理**:
- 500: 服务器内部错误
- 404: Feed 数据不存在

**实现文件**: [src/pages/api/feed/index.tsx](file:///d:/code/1/kami/src/pages/api/feed/index.tsx)

---

#### 2. Sitemap API

**路径**: `/api/sitemap`

**方法**: `GET`

**功能**: 生成站点地图

**参数**: 无

**返回值格式**:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>页面URL</loc>
    <lastmod>最后修改时间</lastmod>
  </url>
</urlset>
```

**错误处理**:
- 500: 服务器内部错误
- 404: Sitemap 数据不存在

**实现文件**: [src/pages/api/sitemap/index.tsx](file:///d:/code/1/kami/src/pages/api/sitemap/index.tsx)

---

### Mix Space API 集成

Kami 通过 `@mx-space/api-client` 与 Mix Space Core v8.6.0 进行交互，支持以下 API 控制器：

#### 核心控制器

| 控制器 | 功能 | 主要方法 |
|-------|------|---------|
| `aggregate` | 聚合数据 | `get()`, `proxy.feed.get()`, `proxy.sitemap.get()` |
| `post` | 文章管理 | `getList()`, `get()`, `getCategoryList()` |
| `note` | 手记管理 | `getList()`, `get()`, `getTopics()` |
| `say` | 说说管理 | `getList()`, `get()` |
| `comment` | 评论管理 | `getList()`, `create()`, `delete()` |
| `user` | 用户管理 | `get()`, `login()`, `register()` |
| `page` | 页面管理 | `getList()`, `get()` |
| `project` | 项目管理 | `getList()`, `get()` |
| `friend` | 友链管理 | `getList()`, `apply()` |
| `snippet` | 配置片段 | `get()` |
| `proxy` | 代理接口 | `options.url.get()` |

#### API 客户端使用示例

```typescript
// 获取文章列表
const { data } = await apiClient.post.getList({
  page: 1,
  size: 10,
})

// 获取手记详情
const { data } = await apiClient.note.get(noteId)

// 创建评论
const { data } = await apiClient.comment.create({
  postId: postId,
  content: '评论内容',
})

// 用户登录
const { data } = await apiClient.user.login({
  username: 'username',
  password: 'password',
})
```

---

### WebSocket 实时通信

#### 连接配置

```typescript
// src/socket/socket-client.ts
const socket = io(`${GATEWAY_URL}/web`, {
  timeout: 10000,
  reconnectionDelay: 3000,
  autoConnect: false,
  reconnectionAttempts: 3,
  transports: ['websocket'],
})
```

#### 支持的事件类型

| 事件类型 | 描述 | 数据格式 |
|---------|------|---------|
| `message` | 通用消息事件 | `{ type: string, data: any }` |
| `post.created` | 文章创建事件 | `Post` 对象 |
| `post.updated` | 文章更新事件 | `Post` 对象 |
| `note.created` | 手记创建事件 | `Note` 对象 |
| `comment.created` | 评论创建事件 | `Comment` 对象 |
| `say.created` | 说说创建事件 | `Say` 对象 |

#### 使用示例

```typescript
// 监听事件
eventBus.on('post.created', (data) => {
  console.log('新文章创建:', data)
})

// 发送事件
socketClient.emit('message', {
  type: 'ping',
  data: { timestamp: Date.now() }
})
```

**实现文件**: [src/socket/socket-client.ts](file:///d:/code/1/kami/src/socket/socket-client.ts)

---

### 请求缓存机制

#### 缓存策略

- **缓存类型**: 内存缓存 (MemoryCache)
- **默认 TTL**: 10 秒 (针对 `/aggregate` 和 `/snippet` 接口)
- **缓存键**: 基于 HTTP 方法、URL、参数和请求体生成

#### 缓存配置

```typescript
// src/utils/request/cache.ts
interface CacheConfig {
  ttlMs?: number  // 缓存过期时间（毫秒）
}

// 使用示例
const { data } = await apiClient.post.getList({}, {
  meta: {
    cache: {
      ttlMs: 30000  // 缓存 30 秒
    }
  }
})
```

#### 去重机制

- **功能**: 防止相同请求重复发送
- **实现**: 使用 `inflight` Map 存储进行中的请求
- **触发条件**: 相同的请求键

---

### 请求重试机制

#### 重试策略

- **算法**: 指数退避 (Exponential Backoff)
- **最大重试次数**: 3 次
- **重试条件**:
  - GET、HEAD、OPTIONS 请求
  - 非 4xx 错误（除 408 外）
  - 非取消请求

#### 重试配置

```typescript
// src/utils/request/retry.ts
interface RetryConfig {
  maxRetries?: number  // 最大重试次数，默认 3
}

// 使用示例
const { data } = await apiClient.post.getList({}, {
  meta: {
    retry: {
      maxRetries: 5  // 最多重试 5 次
    }
  }
})
```

#### 退避延迟计算

```typescript
// 延迟 = baseDelay * (2 ^ attempt)
// baseDelay = 1000ms
// attempt: 0 -> 1000ms
// attempt: 1 -> 2000ms
// attempt: 2 -> 4000ms
```

---

### 错误处理机制

#### 错误类型

| 错误类型 | HTTP 状态码 | 处理方式 |
|---------|------------|---------|
| 网络超时 | 408 | 提示用户检查网络 |
| 未授权 | 401 | 提示登录已过期 |
| 客户端错误 | 4xx | 显示业务错误信息 |
| 服务端错误 | 5xx | 提示服务暂时不可用 |
| 请求取消 | - | 静默处理 |

#### 错误上报

- **工具**: Sentry
- **上报条件**:
  - 5xx 错误
  - 408 超时错误
  - `ECONNABORTED` 错误

#### 错误处理示例

```typescript
// src/utils/client.ts
$axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 重试逻辑
    if (shouldRetry(error, config)) {
      const delay = calcBackoffDelay(attempt)
      await sleep(delay)
      return $axios.request(config)
    }
    
    // 错误提示
    if (status === 408) {
      message.error('请求超时，请检查一下网络哦！')
    } else if (status === 401) {
      message.error('登录已过期或未授权')
    } else if (status >= 500) {
      message.error('服务暂时不可用，请稍后再试')
    }
    
    // 错误上报
    reportError(error, {
      source: 'axios',
      status,
      code: error.code,
      method: config.method,
      url: config.url,
    })
    
    return Promise.reject(error)
  }
)
```

---

## 🛠️ 开发说明

### 开发环境要求

#### 系统要求

- **操作系统**: Windows、macOS、Linux
- **Node.js**: >= 18.18.0
- **包管理器**: pnpm 9.4.0+

#### 推荐开发工具

- **IDE**: VS Code
- **浏览器**: Chrome >= 94, Safari >= 14, Firefox (最新 2 个版本)
- **Git**: 最新版本

---

### 环境搭建步骤

#### 1. 克隆项目

```bash
# 克隆仓库（使用 Git LFS）
git clone https://github.com/mx-space/kami.git
cd kami

# 拉取大文件
git lfs fetch --all
git lfs pull
```

#### 2. 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

#### 3. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，配置以下变量：
NEXT_PUBLIC_API_URL=http://127.0.0.1:2333/api/v2
NEXT_PUBLIC_GATEWAY_URL=http://127.0.0.1:2333
NEXT_PUBLIC_SNIPPET_NAME=kami
ASSETPREFIX=
```

**环境变量说明**:

| 变量名 | 说明 | 示例值 |
|-------|------|-------|
| `NEXT_PUBLIC_API_URL` | Mix Space API 地址 | `http://127.0.0.1:2333/api/v2` |
| `NEXT_PUBLIC_GATEWAY_URL` | WebSocket Gateway 地址 | `http://127.0.0.1:2333` |
| `NEXT_PUBLIC_SNIPPET_NAME` | 配置片段名称 | `kami` |
| `ASSETPREFIX` | CDN 资源前缀（可选） | `https://cdn.example.com` |

#### 4. 启动开发服务器

```bash
# 启动开发服务器（端口 2323）
pnpm dev

# 或者使用 npm
npm run dev
```

开发服务器将在 `http://localhost:2323` 启动。

---

### 开发规范

#### 代码风格

项目使用以下工具进行代码规范管理：

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Stylelint**: 样式检查
- **Husky**: Git Hooks
- **lint-staged**: 暂存文件检查



### 开发注意事项

#### 1. Next.js 配置

- **构建模式**: 使用 Webpack（`--webpack` 标志）
- **输出模式**: `standalone`（独立输出）
- **实验性功能**: 滚动恢复 (`scrollRestoration`)

#### 2. 样式开发

- **CSS 框架**: WindiCSS
- **CSS 预处理器**: PostCSS
- **样式组织**: CSS Modules + 全局样式

#### 3. 状态管理

- **状态库**: Zustand
- **数据获取**: SWR
- **网络状态**: 自定义 `useNetworkStore`

#### 4. 错误处理

- **错误边界**: React Error Boundary
- **错误上报**: Sentry
- **日志记录**: 统一 Logger

#### 5. 性能优化

- **代码分割**: Next.js 自动代码分割
- **图片优化**: Next.js Image 组件
- **懒加载**: React Intersection Observer
- **请求缓存**: 自定义缓存机制

---

### 测试

#### E2E 测试

```bash
# 运行 E2E 测试
pnpm test:e2e

# 或者使用 npm
npm run test:e2e
```

#### 视觉回归测试

```bash
# 运行视觉回归测试
pnpm test:visual

# 或者使用 npm
npm run test:visual
```

#### API 对比测试

```bash
# 运行 API 对比测试
pnpm test:api-compare

# 或者使用 npm
npm run test:api-compare
```

#### 性能测试

```bash
# 运行性能测试
pnpm test:perf

# 或者使用 npm
npm run test:perf
```

---

### 构建与部署

#### 本地构建

```bash
# 构建生产版本
pnpm build

# 或者使用 npm
npm run build
```

#### Bundle 分析

```bash
# 分析 Bundle 大小
pnpm analyze

# 或者使用 npm
npm run analyze
```

#### 生产环境运行

```bash
# 使用 PM2 运行
pnpm prod:pm2

# 或者使用 npm
npm run prod:pm2
```

#### Docker 部署

```bash
# 构建镜像
docker build -t kami .

# 运行容器
docker run -p 3000:3000 kami
```

---

### 调试技巧

#### 1. 开发者工具

- **React DevTools**: React 组件调试
- **Redux DevTools**: Zustand 状态调试
- **Network Tab**: 网络请求调试
- **Console**: 日志输出

#### 2. 日志查看

```typescript
// 使用统一 Logger
import { log } from '~/utils/logger'

log('info', '信息日志')
log('warn', '警告日志')
log('error', '错误日志')
```

#### 3. 错误追踪

- **Sentry**: 生产环境错误追踪
- **本地调试**: 开发环境控制台输出


#### 4. Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### 配置方法

#### 1. 基础配置

在 Mix Space 后台创建配置片段：

1. 登录 Mix Space 管理后台
2. 进入「区块与片段」
3. 新建片段，名称为 `kami`，引用为 `theme`
4. 复制 [config.example.yaml](file:///d:/code/1/kami/config.example.yaml) 内容
5. 根据需求修改配置

#### 2. 配置项说明

```yaml
name: kami  # 站点名称

site:
  theme_color:  # 主题颜色
    light: '#39c5bb'
    dark: '#1f8f93'
  favicon: https://example.com/favicon.svg  # 网站图标
  
  figure:  # 随机图片列表
    - https://example.com/image1.jpg
    - https://example.com/image2.jpg
  
  background:  # 背景图片
    src:
      light: https://example.com/bg-light.png
      dark: https://example.com/bg-dark.png
    position: top center fixed
  
  header:  # 头部导航
    menu:
      - title: 源
        path: /
        type: Home
        icon: faDotCircle
  
  footer:  # 页脚配置
    home_page: https://example.com
    motto:
      content: Stay hungry. Stay foolish.
      author: Steve Jobs

function:
  player:  # 音乐播放器
    id:
      - 563534789  # 网易云歌单 ID
  
  analyze:  # 统计分析
    enable: true
    ga: ''  # Google Analytics ID
    baidu: ''  # 百度统计 ID
    umami:
      id: ''  # Umami ID
      url: ''  # Umami URL
  
  donate:  # 捐赠配置
    enable: true
    link: https://afdian.net/@username
    qrcode:
      - https://example.com/qrcode.png

page:
  home:  # 首页配置
    sections:
      - post
      - note
      - friend
      - more
```

#### 3. 环境变量配置

在部署平台配置以下环境变量：

| 变量名 | 说明 | 必填 |
|-------|------|------|
| `NEXT_PUBLIC_API_URL` | Mix Space API 地址 | 是 |
| `NEXT_PUBLIC_GATEWAY_URL` | WebSocket Gateway 地址 | 是 |
| `NEXT_PUBLIC_SNIPPET_NAME` | 配置片段名称 | 否（默认 kami） |
| `ASSETPREFIX` | CDN 资源前缀 | 否 |
| `SENTRY` | 启用 Sentry | 否 |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN | 否 |

---

### 基本操作指南

#### 1. 首页配置

首页支持多个区块，可在配置文件中自定义：

```yaml
page:
  home:
    sections:
      - post      # 文章区块
      - note      # 手记区块
      - friend    # 友链区块
      - more      # 更多区块
```

#### 2. 文章管理

- **发布文章**: 在 Mix Space 后台创建文章
- **分类管理**: 支持多级分类
- **标签系统**: 支持文章标签
- **置顶功能**: 可置顶重要文章

#### 3. 手记管理

- **创建手记**: 在 Mix Space 后台创建手记
- **主题分类**: 支持手记主题
- **密码保护**: 支持密码保护手记
- **时间线展示**: 按时间线展示手记

#### 4. 评论系统

- **评论功能**: 支持文章和手记评论
- **回复功能**: 支持评论回复
- **@提及**: 支持 @ 用户
- **表情包**: 支持表情包

#### 5. 友链管理

- **友链申请**: 支持友链申请
- **友链审核**: 需要后台审核
- **友链分类**: 支持友链分类

#### 6. 音乐播放器

- **歌单配置**: 配置网易云歌单 ID
- **播放控制**: 支持播放、暂停、切歌
- **歌词显示**: 支持歌词显示

---

### 常见问题解决方案

#### 1. 部署后页面空白

**原因**: 环境变量未正确配置

**解决方案**:
```bash
# 检查环境变量是否正确设置
echo $NEXT_PUBLIC_API_URL
echo $NEXT_PUBLIC_GATEWAY_URL

# 重新部署
vercel --prod
```

#### 2. 图片无法加载

**原因**: CDN 配置错误或图片路径问题

**解决方案**:
```yaml
# 检查配置文件中的图片路径
site:
  figure:
    - https://cdn.jsdelivr.net/gh/username/repo@master/image.jpg

# 或者使用相对路径
  figure:
    - /assets/images/image.jpg
```

#### 3. WebSocket 连接失败

**原因**: Gateway URL 配置错误或防火墙阻止

**解决方案**:
```bash
# 检查 Gateway URL 是否正确
# 确保防火墙允许 WebSocket 连接
# 检查 Nginx 配置是否支持 WebSocket
```

#### 4. 构建失败

**原因**: Node.js 版本过低或依赖冲突

**解决方案**:
```bash
# 检查 Node.js 版本
node --version  # 需要 >= 18.18.0

# 清理缓存
rm -rf .next node_modules pnpm-lock.yaml

# 重新安装依赖
pnpm install

# 重新构建
pnpm build
```

#### 5. 样式丢失

**原因**: WindiCSS 配置问题或样式文件路径错误

**解决方案**:
```bash
# 检查 WindiCSS 配置
cat windi.config.ts

# 确保样式文件正确导入
# 检查 CSS Modules 是否正确使用
```

#### 6. API 请求失败

**原因**: API URL 配置错误或后端服务未启动

**解决方案**:
```bash
# 检查 API URL 是否正确
# 确保后端服务正常运行
# 检查网络连接
curl $NEXT_PUBLIC_API_URL
```

#### 7. 内存泄漏

**原因**: Next.js 13 低版本存在内存泄漏问题

**解决方案**:
```bash
# 升级 Node.js 到 >= 18.18.0
node --version

# 升级 Next.js 到最新版本
pnpm update next
```

#### 8. 性能问题

**原因**: 未启用缓存或图片未优化

**解决方案**:
```typescript
// 启用请求缓存
const { data } = await apiClient.post.getList({}, {
  meta: {
    cache: {
      ttlMs: 30000
    }
  }
})

// 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src="/image.jpg"
  width={500}
  height={300}
  alt="Description"
/>
```

---

## ✨ 功能特性

### 内容管理

- **博文（技术文章）**: 支持 Markdown、代码高亮、数学公式
- **手记**: 轻量级笔记，支持密码保护
- **说说（一言）**: 短内容分享
- **动态**: 实时动态展示
- **评论**: 支持评论、回复、@提及
- **独立页面**: 自定义页面
- **项目**: 项目展示
- **分类/专栏**: 内容分类管理

### 功能特性

- **埋点**: 支持 Umami、Google Analytics、百度统计
- **实时更新**: Socket.IO 实时通信
- **配置动态化**: 后台动态配置
- **PWA 支持**: 已移除（v3.15.0）

### 视觉交互

- **暗色模式**: 支持亮色/暗色主题切换
- **响应式支持**: 适配移动端、平板、桌面
- **Spring 动效全覆盖**: 流畅的动画效果
- **打印样式适配**: 优化的打印样式 (CMD+P)

### 附加功能

- **音乐页**: 网易云音乐播放器
- **追番页**: Bangumi 追番记录

---

## 🛠️ 技术栈

### 核心框架

- **React**: 18.3.1 - UI 框架
- **Next.js**: 16.1.1 - React 框架
- **TypeScript**: 5.2.2 - 类型系统

### 状态管理

- **Zustand**: 4.4.3 - 轻量级状态管理
- **SWR**: 2.2.4 - 数据获取

### UI 组件

- **Framer Motion**: 10.16.4 - 动画库
- **React Icons**: 图标库
- **WindiCSS**: 3.5.6 - CSS 框架

### 网络请求

- **Axios**: 1.5.1 - HTTP 客户端
- **@mx-space/api-client**: 1.17.0 - Mix Space API 客户端
- **Socket.IO Client**: 4.7.2 - WebSocket 客户端

### 工具库

- **Day.js**: 1.11.10 - 时间处理
- **Lodash-es**: 4.17.21 - 工具函数
- **Validator**: 13.11.0 - 数据验证

### Markdown 渲染

- **markdown-to-jsx**: 7.1.3-beta.2 - Markdown 渲染
- **KaTeX**: 数学公式渲染
- **Mermaid**: 10.5.0 - 图表渲染

### 监控与日志

- **Sentry**: 10.34.0 - 错误监控
- **React Error Boundary**: 4.0.13 - 错误边界

### 测试工具

- **Cypress**: 13.15.0 - E2E 测试
- **Playwright**: 1.50.1 - 视觉回归测试
- **Lighthouse**: 11.7.1 - 性能测试

### 开发工具

- **ESLint**: 9.0.0 - 代码检查
- **Prettier**: 3.0.3 - 代码格式化
- **Husky**: 8.0.3 - Git Hooks
- **lint-staged**: 15.0.2 - 暂存文件检查

---

## 📝 Markdown 扩展语法

### 支持的语法

- **GFM**: GitHub Flavored Markdown
- **Insert**: `++Insert++`
- **Spoiler**: `||Spoiler||`
- **Mention**: `{GH@Innei}` `{TW@Innei}` `{TG@Innei}`
- **KaTeX**: `$ c = \pm\sqrt{a^2 + b^2} $`
- **Mark**: `==Mark==`
- **React Component (JSX)**: 支持 JSX 组件
- **Container**: `::: type {params}`

### 支持的 Container

#### 1. Gallery

多图展示容器。

```markdown
::: gallery
![alt](url "title")
![alt](url "title")
:::
```

#### 2. Banner

提示容器。可选参数 `info` `warning` `error` `success`

```markdown
::: banner {info}
一个提示。
:::
```

或者：支持 `info` `warning` `error` `success` `warn` `danger`

```markdown
::: warning
警告
:::

::: success
成功
:::

::: info
提示
:::
```

### 支持的 React Component

#### 1. LinkCard

```jsx
<LinkCard id="notes/111" source="self" />
```

```typescript
type LinkCardSource = 'gh' | 'self'

interface LinkCardProps {
  id: string
  source: LinkCardSource
  className?: string
}
```


## ⚠️ Notice

可以在此基础上保留署名进行二次创作，但是禁止用于以盈利为目的一切活动。

---

## 📄 License

此项目 GPLv3 授权开源，使用此项目进行的二次创作或者衍生项目也必须开源。

---

风格参考于 [保罗的小窝](https://paul.ren)

## Kami is Sunsetting

Kami 原本是我用于学习前端时建立的渐进式个人网站项目，随着代码越来越难以维护和 UI 风格越来越混杂，在 2023.6 我决定进行重写此项目。

下一个代替项目将会是 Shiro，当它完成之时，我便不再投入任何精力到 Kami 中。迎接未来总需要舍弃一些东西，非常感谢大家三年来使用 Kami，不管你是谁，都需要对你说声谢谢。

---

Kami was originally a progressive personal website project that I built while learning the front end, but as the code became more difficult to maintain and the UI style became more mixed, I decided to rewrite the project in 2023.6.

The next replacement project will be [Shiro](https://github.com/Innei/Shiro), and when it's done, I won't put any more effort into Kami. There are always things to let go of when embracing the future, so thank you very much for using Kami for three years, and thank you to whoever you are.

2020 - 2023.
