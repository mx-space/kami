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
import type { FC } from 'react'
import RemoveMarkdown from 'remove-markdown'

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

export const resolveUrl = (pathname: string | undefined, base: string) => {
  return base.replace(/\/$/, '').concat(pathname || '')
}

export const NoSSR = <T = any>(comp: FC<T>) =>
  dynamic(() => Promise.resolve(comp), { ssr: false }) as FC<T>

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

const _noop = {}
export const noop = new Proxy(_noop, {
  get(a, b, c) {
    return noop
  },
  apply() {
    // eslint-disable-next-line prefer-rest-params
    return Reflect.apply(noop, this, arguments)
  },
})
