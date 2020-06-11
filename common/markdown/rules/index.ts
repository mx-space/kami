/*
 * @Author: Innei
 * @Date: 2020-06-11 12:25:50
 * @LastEditTime: 2020-06-11 13:38:58
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/markdown/rules/index.ts
 * @Coding with Love
 */

import { mentions } from './mentions'
import { spoiler } from './spoiler'
export const plugins = { mentions, spoiler }

export default Object.values(plugins)
