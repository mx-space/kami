import { commentAt } from './comment-at'

/*
 * @Author: Innei
 * @Date: 2020-06-11 12:25:50
 * @LastEditTime: 2020-07-21 16:55:56
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/markdown/rules/index.ts
 * @Coding with Love
 */
import { mentions } from './mentions'
import { spoiler } from './spoiler'

export { commentAt } from './comment-at'
export const plugins = { mentions, spoiler, commentAt }

export default Object.values(plugins)
