# Kami.

[![wakatime](https://wakatime.com/badge/github/mx-space/kami.svg)](https://wakatime.com/badge/github/mx-space/kami)

小小空间，大大梦想。

Small space, big dream.

---

Kami 是一个为 Mix Space 打造的主站前端。完美覆盖全部功能。

Live Demo:

- <https://innei.ren>

![](https://user-images.githubusercontent.com/41265413/169677737-9b407450-ec95-4d30-b5ca-818cf1d18bdb.png)
![](https://github.com/mx-space/docs-images/blob/master/images/bg.jpg?raw=true)

## Feature

内容：

- 博文（技术文章）
- 生活记录（日记）
- 说说（一言）
- 动态
- 评论
- 独立页面
- 项目
- 分类/专栏
- etc.

功能：

- 埋点（umami, GA）
- 实时更新（Socket 支持）
- ~~PWA 支持~~（看上去没必要的功能，在 v3.15.0 中移除）
- 配置动态化

视觉交互：

- 暗色模式
- 响应式支持
- Spring 动效全覆盖
- 打印样式适配（CMD+P）

附加：

- 音乐页
- 追番页

## Tech Stack

- React
- NextJS
- Socket.IO
- [Kami Design](./packages/kami-design/readme.md)

## How to usage

> 在此之前，请先完成部署 Mix Space

参考[文档](https://mx-space.js.org/deploy/index.html#%E9%83%A8%E7%BD%B2-kami)

## Clone

此仓库使用 Git LFS 管理图片等大文件，请先安装 Git LFS。

```bash
git clone https://github.com/mx-space/kami.git
cd kami
git lfs fetch --all
git lfs pull
```

方可获取到图片文件。

## Markdown 扩展语法

- GFM
- Insert: `++Insert++`
- Spoilder: `||Spoilder||`
- Mention: `{GH@Innei}` `{TW@Innei}` `{TG@Innei}`
- KateX: `$ c = \\pm\\sqrt{a^2 + b^2} $`
- Mark: `==Mark==`
- React Component (JSX)
- Container: `::: type {params}`

### 支持的 Container

1. Gallery

一个多图展示容器。

```mark
::: gallery
![alt](url "title")
![alt](url "title")
:::
```

2. Banner

提示容器。可选参数 `info` `warning` `error` `success`

```mark
::: banner {info}
一个提示。
:::
```

### 支持的 React Component

1. LinkCard

```js
<LinkCard id="notes/111" source="self" />
```

```ts
type LinkCardSource = 'gh' | 'self'

interface LinkCardProps {
  id: string
  source: LinkCardSource
  className?: string
}
```

## Migration to Kami v3

升级 Server 到 v3.13.0 以上，在设置中的「区块与片段」中新建一个名为 `kami`，引用为 `theme`，内容为可配置项，可参考： [config.example.yaml](./config.example.yaml)

[配置项](https://mx-docs.shizuri.net/deploy/kami#%E6%9B%B4%E4%B8%BA%E8%AF%A6%E7%BB%86%E7%9A%84%E9%85%8D%E7%BD%AE%E9%A1%B9)

## Discussion

QQ 群：[615052447](https://jq.qq.com/?_wv=1027&k=5t9N0mw)

## Notice

可以在此基础上保留署名进行二次创作，但是禁止用于以盈利为目的一切活动。

## License

此项目 GPLv3 授权开源，使用此项目进行的二次创作或者衍生项目也必须开源。

---

风格参考于 [保罗的小窝](https://paul.ren)
