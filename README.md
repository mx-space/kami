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

Live Demo:

- <https://dev.innei.ren>
- <https://www.timochan.cn/>
- <https://www.suemor.com/>
- <https://www.miaoer.xyz/>

点击下面按钮，立即部署到 Vercel！

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmx-space%2Fkami&env=NEXT_PUBLIC_API_URL,NEXT_PUBLIC_GATEWAY_URL&envDescription=API%20%E5%9C%B0%E5%9D%80%E5%92%8C%E7%BD%91%E5%85%B3%E5%9C%B0%E5%9D%80&project-name=kami-web)

![](https://user-images.githubusercontent.com/41265413/169677737-9b407450-ec95-4d30-b5ca-818cf1d18bdb.png)
![](https://github.com/mx-space/docs-images/blob/master/images/bg.jpg?raw=true)

## Feature

内容：

- 博文（技术文章）
- 手记
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

## How to usage

> 在此之前，请先完成部署 Mix Space

参考[文档](https://mx-space.js.org/themes/kami)

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

或者：支持 `info` `warning` `error` `success` `warn` `danger`

```mark
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

## Notice

可以在此基础上保留署名进行二次创作，但是禁止用于以盈利为目的一切活动。

## License

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
