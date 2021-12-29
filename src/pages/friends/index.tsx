import { LinkModel, LinkType } from '@mx-space/api-client'
import { useInitialData } from 'common/hooks/use-initial-data'
import { NextPage } from 'next'
import { createElement, FC } from 'react'
import { NoSSR } from 'utils'
import { apiClient } from 'utils/client'
import Markdown from 'views/Markdown'
import { QueueAnim } from '../../components/Anime'
import { SEO } from '../../components/SEO'
import { ArticleLayout } from '../../layouts/ArticleLayout'
import { ApplyForLink } from '../../views/for-pages/ApplyLink'

const renderSection = (data: LinkModel[]) => {
  return (
    <div className="note-item">
      <ul>
        <QueueAnim delay={700}>
          <div className="" key={data.length}>
            {data.map((link) => {
              return (
                <li key={link.id}>
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

          **我希望贵站不是商业化门户网站，亦或是植有影响观看体验广告的网站。**

<br />

          # 本站信息

          **站点标题**: [${seo.title}](${
          location.protocol + '//' + location.host
        })
          **站点描述**: ${seo.description}
          **主人头像**: [点击下载](${avatar})
          **主人名字**: ${name}
           `
          .split('\n')
          .map((i) => i.trim())
          .join('\n')}
      />
    </QueueAnim>
  )
}

const Footer = NoSSR(_Footer)
FriendsView.getInitialProps = async () => {
  const { data } = await apiClient.link.getAll()

  return { data } as { data: LinkModel[] }
}
export default FriendsView
