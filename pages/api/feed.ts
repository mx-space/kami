/*
 * @Author: Innei
 * @Date: 2020-06-14 20:57:01
 * @LastEditTime: 2021-03-14 13:56:51
 * @LastEditors: Innei
 * @FilePath: /web/pages/api/feed.ts
 * @Coding with Love
 */

import rules from 'common/markdown/rules'
import { IncomingMessage, ServerResponse } from 'http'
import normalize from 'mdurl/encode.js'
import { AggregateResp } from 'models/aggregate'
import html from 'remark-html'
import markdown from 'remark-parse'
import unified from 'unified'
import { escapeHTMLTag } from 'utils'
import { Rest } from '../../utils/api'
const u = require('unist-builder')
const parser = unified()
  .use(markdown)
  .use(rules)
  .use(html, {
    allowDangerousHtml: true,
    handlers: {
      image: (h, node: any) => {
        // console.log(node)

        const src = node.url as string
        const _alt = node.alt as string | undefined
        const alt = _alt?.match(/^[!¡]/) ? _alt!.replace(/^[¡!]/, '') : ''
        if (!alt) {
          return h(node, 'img', { src })
        }
        return h(node, 'figure', {}, [
          h(node, 'img', { src: normalize(src) }),
          h.augment(
            node,
            u(
              'raw',
              `<figcaption style="text-align: center; margin: 1em auto;">${escapeHTMLTag(
                alt,
              )}</figcaption>`,
            ),
          ),
        ])
      },
      spoiler: (h, node: any) => {
        return h(
          node,
          'del',
          {
            class: 'spoiler',
            style: 'filter: invert(25%);',
          },
          [
            h.augment(
              node,
              u(
                'raw',
                `<style>
            .spoiler {
              background-color: currentColor;transition: all .5s;text-decoration: none;
            }
            .spoiler:hover {
              background-color: transparent;
            }
            </style>`,
              ),
            ),
            {
              type: 'text',
              // @ts-ignore
              value: node.value,
            },
          ],
        )
      },
    },
  })

const encodeHTML = escapeHTMLTag
const genRSS = async (props: RSSProps) => {
  const { url, author, data } = props
  const aggregate = await Rest('Aggregate').get<AggregateResp>()
  const avatar = aggregate.user.avatar
  const title = aggregate.seo.title
  return `<?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${title}</title>
      <link href="/atom.xml" rel="self"/>
      <link href="/feed" rel="self"/>
      <link href="${encodeHTML(url)}"/>
      <updated>${new Date().toISOString()}</updated>
      <id>${encodeHTML(url)}</id>
      <author>
        <name>${author}</name>
      </author>
      <generator>${'Mix Space CMS'}</generator>
      <language>zh-CN</language>
      <image>
          <url>${encodeHTML(avatar)}</url>
          <title>${title}</title>
          <link>${encodeHTML(url)}</link>
      </image>
        ${data.map((item) => {
          return `<entry>
            <title>${item.title}</title>
            <link href="${encodeHTML(item.link)}"/>
            <id>${encodeHTML(item.link)}</id>
            <published>${item.created}</published>
            <updated>${item.modified}</updated>
            <content type="html"><![CDATA[
              <blockquote>该渲染由 unified 生成, 可能存在部分语句不通或者排版问题, 最佳体验请前往: <a href="${encodeHTML(
                item.link,
              )}">${encodeHTML(item.link)}</a></blockquote>
              ${parser.processSync(item.text).toString()}
              <p>
              <a href="${encodeHTML(item.link) + '#comments'}">评论</a>
              </p>
            ]]>
            </content>
            </entry>
          `
        })}
    </feed>`
}

interface RSSProps {
  title: string
  url: string
  author: string
  data: {
    created: string | Date
    modified: string | Date
    link: string
    title: string
    text: string
  }[]
}
export default async function RSSFunc(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const rss = (await Rest('Aggregate').get('feed')) as RSSProps
  res.setHeader('Content-Type', 'text/xml')
  res.write(await genRSS(rss))
  res.end()
}
