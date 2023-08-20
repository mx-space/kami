import { compiler } from 'markdown-to-jsx'
import type { NextApiResponse } from 'next'
import xss from 'xss'

import type { AggregateRoot } from '@mx-space/api-client'

import { ContainerRule } from '~/components/ui/Markdown/parsers/container'
import { InsertRule } from '~/components/ui/Markdown/parsers/ins'
import { MarkRule } from '~/components/ui/Markdown/parsers/mark'
import { MentionRule } from '~/components/ui/Markdown/parsers/mention'
import { SpoilderRule } from '~/components/ui/Markdown/parsers/spoiler'
import { apiClient } from '~/utils/client'

export default async function handler(_, res: NextApiResponse) {
  const ReactDOM = (await import('react-dom/server')).default

  const path = apiClient.aggregate.proxy.feed.toString(true)
  const { author, data, url } = await fetch(path).then((res) => res.json())

  const agg = await fetch(apiClient.aggregate.proxy.toString(true)).then(
    (res) => res.json() as Promise<AggregateRoot>,
  )

  const { title } = agg.seo
  const { avatar } = agg.user
  const now = new Date()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${title}</title>
      <link href="/atom.xml" rel="self"/>
      <link href="/feed" rel="self"/>
      <link href="${xss(url)}"/>
      <updated>${now.toISOString()}</updated>
      <id>${xss(url)}</id>
      <author>
        <name>${author}</name>
      </author>
      <generator>Mix Space CMS</generator>
      <lastBuildDate>${now.toISOString()}</lastBuildDate>
      <language>zh-CN</language>
      <image>
          <url>${xss(avatar || '')}</url>
          <title>${title}</title>
          <link>${xss(url)}</link>
      </image>
        ${await Promise.all(
          data.map(async (item: any) => {
            return `<entry>
            <title>${escapeXml(item.title)}</title>
            <link href='${xss(item.link)}'/>
            <id>${xss(item.link)}</id>
            <published>${item.created}</published>
            <updated>${item.modified}</updated>
            <content type='html'><![CDATA[
              ${`<blockquote>该渲染由 Kami API 生成，可能存在排版问题，最佳体验请前往：<a href='${xss(
                item.link,
              )}'>${xss(item.link)}</a></blockquote>
${ReactDOM.renderToString(
  <div>
    {compiler(item.text, {
      overrides: {
        LinkCard: () => null,
        Gallery: () => (
          <div style={{ textAlign: 'center' }}>这个内容只能在原文中查看哦~</div>
        ),
      },
      additionalParserRules: {
        spoilder: SpoilderRule,
        mention: MentionRule,

        mark: MarkRule,
        ins: InsertRule,
        // kateX: KateXRule,
        container: ContainerRule,
      },
    })}
  </div>,
)}
              <p style='text-align: right'>
              <a href='${`${xss(item.link)}#comments`}'>看完了？说点什么呢</a>
              </p>`}
            ]]>
            </content>
            </entry>
          `
          }),
        ).then((res) => res.join(''))}
    </feed>`

  res.setHeader('Content-Type', 'application/xml')
  return res.send(xml)
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
    }
    return c
  })
}
