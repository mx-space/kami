/*
 * @Author: Innei
 * @Date: 2020-06-20 20:51:31
 * @LastEditTime: 2021-05-29 17:51:50
 * @LastEditors: Innei
 * @FilePath: /web/utils/utils.ts
 * @Coding with Love
 */

import type { ServerResponse } from 'http'
import dynamic from 'next/dynamic'
import { ComponentType } from 'react'
import RemoveMarkdown from 'remove-markdown'

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
