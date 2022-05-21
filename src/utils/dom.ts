/*
 * @Author: Innei
 * @Date: 2020-05-24 17:03:12
 * @LastEditTime: 2021-01-14 13:16:05
 * @LastEditors: Innei
 * @FilePath: /web/utils/dom.ts
 * @Copyright
 */
import type { BaseSyntheticEvent } from 'react'

export const stopEventDefault = <T extends BaseSyntheticEvent>(e: T) => {
  e.preventDefault()
  e.stopPropagation()
}

export function getElementViewTop<T extends HTMLElement>(element: T) {
  let actualTop = element.offsetTop
  let current = element.offsetParent as HTMLElement

  while (current !== null) {
    actualTop += current.offsetTop
    current = current.offsetParent as HTMLElement
  }
  let elementScrollTop = 0
  if (document.compatMode == 'BackCompat') {
    elementScrollTop = document.body.scrollTop
  } else {
    elementScrollTop = document.documentElement.scrollTop
  }

  return actualTop - elementScrollTop
}
