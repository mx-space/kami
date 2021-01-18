/*
 * @Author: Innei
 * @Date: 2020-12-18 12:15:37
 * @LastEditTime: 2021-01-18 18:26:51
 * @LastEditors: Innei
 * @FilePath: /web/pages/friends/index.tsx
 * @Mark: Coding with Love
 */
import { useInitialData } from 'common/context/InitialDataContext'
import Markdown from 'components/MD-render'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { createElement, FC } from 'react'
import { QueueAnim } from '../../components/Anime'
import { ApplyForLink } from '../../components/ApplyLink'
import { SEO } from '../../components/SEO'
import { ArticleLayout } from '../../layouts/ArticleLayout'
import { LinkModel, LinkType } from '../../models/link'
import { Rest } from '../../utils/api'
const renderSection = (data: LinkModel[]) => {
  return (
    <div className="note-item">
      <ul>
        <QueueAnim delay={700}>
          <div className="" key={data.length}>
            {data.map((link) => {
              return (
                <li key={link._id}>
                  <a href={link.url} target={'_blank'}>
                    {link.name}
                  </a>
                  <span className="meta">{link.description || ''}</span>
                </li>
              )
            })}
          </div>
        </QueueAnim>
      </ul>
    </div>
  )
}

const renderTitle = (text: string, delay: number) => {
  return (
    <QueueAnim delay={delay} type="right">
      <strong key={delay} style={{ fontSize: '1.5rem' }}>
        {text}
      </strong>
    </QueueAnim>
  )
}
const FriendsView: NextPage<{ data: LinkModel[] }> = (props) => {
  const friends: LinkModel[] = []
  const collections: LinkModel[] = []

  for (const link of props.data) {
    if (link.hide) {
      continue
    }
    switch (link.type) {
      case LinkType.Friend: {
        friends.push(link)
        break
      }
      case LinkType.Collection: {
        collections.push(link)
      }
    }
  }

  return (
    <ArticleLayout title={'朋友们'} subtitle={'海内存知己, 天涯若比邻'}>
      <SEO title={'朋友们'} />
      <article className="post-content kami-note article-list">
        {friends.length > 0 && (
          <>
            {collections.length !== 0 && renderTitle('互相关注', 650)}
            {renderSection(friends)}
          </>
        )}
        {collections.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle('个人收藏', 850)}
            {renderSection(collections)}
          </>
        )}
      </article>
      <Footer />
    </ArticleLayout>
  )
}

const _Footer: FC = () => {
  const {
    seo,
    user: { avatar, name },
  } = useInitialData()
  return (
    <QueueAnim delay={1000}>
      <ApplyForLink key={'link'} />

      <Markdown
        key="md"
        warpperProps={{ id: undefined, style: { whiteSpace: 'pre-line' } }}
        renderers={{
          heading: (props) => {
            return createElement(
              `h${props.level}`,
              { className: 'headline' },
              props.children,
            )
          },
        }}
        escapeHtml={false}
        value={`
          **在申请友链之前请先将本站加入贵站的友链中**

          **填写邮箱后, 待通过申请后会发送邮件**

<br />

          # 本站信息

          **站点标题**: [${seo.title}](${
          location.protocol + '//' + location.host
        })
          **站点描述**: ${seo.description}
          **主人头像**: ${avatar}
          **主人名字**: ${name}
           `
          .split('\n')
          .map((i) => i.trim())
          .join('\n')}
      ></Markdown>
    </QueueAnim>
  )
}

const Footer = dynamic(() => Promise.resolve(_Footer), { ssr: false })
FriendsView.getInitialProps = async () => {
  const { data } = (await Rest('Link').get('all')) as any

  return { data } as { data: LinkModel[] }
}
export default FriendsView
