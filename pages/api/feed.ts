/*
 * @Author: Innei
 * @Date: 2020-06-14 20:57:01
 * @LastEditTime: 2020-07-16 21:05:28
 * @LastEditors: Innei
 * @FilePath: /mx-web/pages/api/feed.ts
 * @Coding with Love
 */

import unified from 'unified'
import markdown from 'remark-parse'
import html from 'remark-html'
import rules from 'common/markdown/rules'
const parser = unified().use(markdown).use(html).use(rules)

import { IncomingMessage, ServerResponse } from 'http'
import { Rest } from '../../utils/api'
import configs from '../../configs'
import { AggregateResp } from '../../models/aggregate'
import { NoteModel } from '../../models/note'
import { PostResModel } from '../../models/post'
const encodeHTML = function (str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
const genRSS = (props: RSSProps) => {
  const { title, url, author, data } = props
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
          <url>${encodeHTML(configs.avatar)}</url>
          <title>${configs.title}</title>
          <link>${encodeHTML(url)}</link>
      </image>
        ${data.map((item) => {
          return `<entry>
            <title>${item.title}</title>
            <link href="${encodeHTML(item.link)}"/>
            <id>${encodeHTML(item.link)}</id>
            <published>${item.created}</published>
            <updated>${item.modified}</updated>
            <content type="html"><![CDATA[${parser
              .processSync(item.text)
              .toString()}]]>
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
  res.write(genRSS(rss))
  res.end()
}
