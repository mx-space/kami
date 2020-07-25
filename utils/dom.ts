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

export const copy = (value: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.cssText = `position: absolute; top:0; z-index: -999`
  document.documentElement.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.documentElement.removeChild(textarea)
}
