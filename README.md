# Kami

**你的下一个博客何必是博客**

Kami 是为 Mix Space Server 打造的前端。使用 NextJS 开发。

Kami v3 重构整体架构设计，风格不会有大的变化。

依赖：Mix Space Server >= v3.13.0

与上一版本相比，新的特征有:

- 配置全部动态化，让配置更加简易。
- 性能提升 50%，打包体积缩小 500K，首次加载时间减少 15%
- 修复一些老 Bug，具体是啥看 Git History
- 样式上有微调

Live Demo:

- <https://innei.ren>

![](https://ghproxy.fsou.cc/https://github.com/mx-space/docs-images/blob/master/images/bg.jpg)

## 迁移指南

升级 Server 到 v3.13.0 以上，在设置中的「区块与片段」中新建一个名为 `kami`，引用为 `theme`，内容为可配置项，可参考： [config.example.yaml](https://ghproxy.fsou.cc/https://github.com/mx-space/kami/blob/master/config.example.yaml)

## 忠告

可以在此基础上保留署名进行二次创作，但是禁止用于以盈利为目的一切活动。

## 许可

此项目 GPLv3 授权开源，使用此项目进行的二次创作或者衍生项目也必须开源。

---

感谢 @Dreamer-Paul 提供的风格
