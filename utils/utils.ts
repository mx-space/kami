/*
 * @Author: Innei
 * @Date: 2020-06-20 20:51:31
 * @LastEditTime: 2021-02-07 14:50:21
 * @LastEditors: Innei
 * @FilePath: /web/utils/utils.ts
 * @Coding with Love
 */

import classNames from 'classnames'
import type { ServerResponse } from 'http'
import shuffle from 'lodash/shuffle'
import dynamic from 'next/dynamic'
import { ComponentType } from 'react'
import RemoveMarkdown from 'remove-markdown'

const animeImages = [
  'qsNmnC2zHB5FW41.jpg',
  'GwJzq4SYtClRcZh.jpg',
  '6nOYcygRGXvpsFd.jpg',
  'Qr2ykmsEFpJn4BC.jpg',
  'KiOuTlCzge7JHh3.jpg',
  'sM2XCJTW8BdUe5i.jpg',
  '18KQYP9fNGbrzJu.jpg',
  'rdjZo6Sg2JReyiA.jpg',
  'X2MVRDe1tyJil3O.jpg',
  'EDoKvz5p7BXZ46U.jpg',
  'EGk4qUvcXDygV2z.jpg',
  '5QdwFC82gT3XPSZ.jpg',
  'KPyTCARHBzpxJ46.jpg',
  '7TOEIPwGrZB1qFb.jpg',
  'Ihj5QAZgVMqr9fJ.jpg',
  'KZ6jv8C92Vpwcih.jpg',
].map((i) => 'https://i.loli.net/2020/05/22/' + i)

export const getAnimationImages = () => {
  return [...animeImages]
}
export const getRandomImage = (count = 1) => {
  return shuffle(animeImages).slice(0, count)
}

export const isClientSide = () => {
  return typeof window !== 'undefined'
}
export const isServerSide = () => {
  return !isClientSide()
}

export const isDev = process.env.NODE_ENV === 'development'

export function getSummaryFromMd(text: string): string
export function getSummaryFromMd(
  text: string,
  options: { count: true; length?: number },
): { description: string; wordCount: number }

export function getSummaryFromMd(
  text: string,
  options: { count?: boolean; length?: number } = {
    count: false,
    length: 150,
  },
) {
  const rawText = RemoveMarkdown(text, { gfm: true })
  const description = rawText.slice(0, options.length).replace(/[\s]/gm, ' ')
  if (options.count) {
    return {
      description,
      wordCount: rawText.length,
    }
  }
  return description
}

export function flattenChildren<T extends { children: T[] }>(
  data: T[],
  level = 0,
): Omit<T, 'children'>[] {
  return data.reduce(
    (arr, { children = [], ...rest }) =>
      // @ts-ignore
      arr.concat([{ ...rest }], flattenChildren(children, level + 1)),
    [],
  )
}

export function _uuid() {
  let d = Date.now()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now() //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
export class UUID {
  public uuid = _uuid()

  public equal(uuid: UUID) {
    return uuid.uuid === this.uuid
  }
}

export const resolveUrl = (pathname: string | undefined, base: string) => {
  const _URL = new URL(base)

  return pathname ? _URL.origin.concat(pathname) : _URL.origin
}

export const combineClassName = (scss: any, css: any) => {
  return (new Proxy(
    { op: (key) => classNames(scss[key], css[key], 'global-' + key) },
    {
      get(target, key: string) {
        return target.op(key)
      },
    },
  ) as any) as Record<string, string>

  // return (key: string) => classNames(scss[key], css[key])
}

export const NoSSR = <T>(comp: ComponentType<T>) =>
  dynamic(() => Promise.resolve(comp), { ssr: false })

// for api server
export const writeBody = (
  res: ServerResponse,
  bodyJSON: any,
  code?: number,
) => {
  res.writeHead(code ?? 200, { 'Content-Type': 'application/json' })
  const json = JSON.stringify(bodyJSON)
  res.end(json)
}

import { UAParser } from 'ua-parser-js'
import { message } from 'utils/message'

export function checkOldBrowser() {
  const parser = new UAParser(window.navigator.userAgent)
  const browser = parser.getBrowser()
  const isOld: boolean = (() => {
    if (browser.name === 'IE') {
      alert(
        '欧尼酱, 乃真的要使用 IE 浏览器吗, 不如换个 Chrome 好不好嘛（o´ﾟ□ﾟ`o）',
      )
      location.href = 'https://www.google.com/chrome/'
      return true
    }
    // check build-in methods
    const ObjectMethods = ['fromEntries', 'entries']
    const ArrayMethods = ['flat']
    if (
      !window.Reflect ||
      !(
        ObjectMethods.every((m) => Reflect.has(Object, m)) &&
        ArrayMethods.every((m) => Reflect.has(Array.prototype, m))
      ) ||
      !window.requestAnimationFrame ||
      !window.Proxy ||
      !window.IntersectionObserver ||
      !window.ResizeObserver ||
      !window.Intl ||
      typeof globalThis === 'undefined' ||
      typeof Set === 'undefined' ||
      typeof Map === 'undefined'
    ) {
      return true
    }

    return false
  })()
  if (isOld) {
    const { name: osName, version: osVersion } = parser.getOS()

    return {
      isOld: true,
      msg: `User browser(${browser.name} ${browser.version}) is too old. OS: ${osName}/${osVersion}`,
    }
  }

  return { isOld: false, msg: '' }
}

export const escapeHTMLTag = (html: string) => {
  const lt = /</g,
    gt = />/g,
    ap = /'/g,
    ic = /"/g
  return html
    .toString()
    .replace(lt, '&lt;')
    .replace(gt, '&gt;')
    .replace(ap, '&#39;')
    .replace(ic, '&#34;')
}
