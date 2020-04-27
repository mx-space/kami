import { NextPage } from 'next'
import markdown from 'markdown-it'
import configs from 'configs'
import { Rest } from 'utils/api'
import { AggregateResp, Top } from 'models/aggregate'
import { PostResModel } from 'models/dto/post'
import { NoteModel } from 'models/dto/note'

const FeedRSS: NextPage = (props) => {
  return null
}

const genRSS = (props: RSSProps) => {
  const { title, url, author, data } = props
  return `<?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${title}</title>
      <link href="/atom.xml" rel="self"/>
      <link href="/feed" rel="self"/>
      <link href="${url}"/>
      <updated>${new Date()}</updated>
      <id>${url}</id>
      <author>
        <name>${author}</name>
      </author>
      <generator>${'Mix Space CMS'}</generator>
      <language>zh-CN</language>
      <image>
          <url><![CDATA[${encodeURI(configs.avatar)}]]></url>
          <title>${configs.title}</title>
          <link>${url}</link>
      </image>
        ${data.map((item) => {
          return `<entry>
            <title>${item.title}</title>
            <link href="${item.link}"/>
            <id>${item.link}</id>
            <published>${item.created}</published>
            <updated>${item.modified}</updated>
            <content type="html"><![CDATA[${new markdown().render(item.text)}]]>
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

FeedRSS.getInitialProps = async (ctx) => {
  const { res } = ctx
  const { seo, user } = (await Rest('Aggregate').get()) as AggregateResp
  const postsResp = (await Rest('Post').gets()) as any
  const notesResp = (await Rest('Note').get('latest')) as any
  const latestNote = notesResp.data as NoteModel
  const posts = postsResp.data as PostResModel[]

  const data: RSSProps['data'] = []

  data.push(
    {
      title: latestNote.title,
      text: latestNote.text,
      created: latestNote.created,
      modified: latestNote.modified,
      link: '/notes/' + latestNote.nid,
    },
    ...posts.map((post) => {
      return {
        title: post.title,
        text: post.text,
        created: post.created,
        modified: post.modified,
        link: '/posts' + `/${post.category.slug}/${post.slug}`, // todo prefix
      }
    }),
  )

  res?.setHeader('Content-Type', 'text/xml')
  res?.write(
    genRSS({
      title: seo.title,
      url: configs.url,
      author: user.name,
      data,
    }),
  )
  res?.end()
}
export default FeedRSS
