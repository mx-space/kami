/*
 * @Author: Innei
 * @Date: 2020-05-24 17:03:12
 * @LastEditTime: 2020-05-24 17:08:58
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/dom.ts
 * @Copyright
 */

import { BaseSyntheticEvent } from 'react'

export const stopEventDefault = <T extends BaseSyntheticEvent>(e: T) => {
  e.preventDefault()
  e.stopPropagation()
}
