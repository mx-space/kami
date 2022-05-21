import {
  BannedSection,
  FavoriteSection,
  FriendSection,
  OutdateSection,
} from 'components/in-page/Friend/section'
import { Markdown } from 'components/universal/Markdown'
import { useInitialData } from 'hooks/use-initial-data'
import { shuffle } from 'lodash-es'
import type { NextPage } from 'next'
import type { FC } from 'react'
import { createElement, useEffect, useState } from 'react'
import { NoSSR } from 'utils'
import { apiClient } from 'utils/client'

import type { LinkModel } from '@mx-space/api-client'
import { LinkState, LinkType } from '@mx-space/api-client'

import { ApplyForLink } from '../../components/in-page/ApplyLink'
import { ArticleLayout } from '../../components/layouts/ArticleLayout'
import { SEO } from '../../components/universal/Seo'

const renderTitle = (text: string) => {
  return <h1 className="!text-xl headline !mt-12">{text}</h1>
}

const FriendsView: NextPage<
  Record<'friends' | 'collections' | 'outdated' | 'banned', LinkModel[]>
> = (props) => {
  const { banned, collections, friends, outdated } = props

  return (
    <ArticleLayout title={'朋友们'} subtitle={'海内存知己, 天涯若比邻'}>
      <SEO title={'朋友们'} />
      <article className="article-list">
        {friends.length > 0 && (
          <>
            {collections.length !== 0 && renderTitle('我的朋友')}
            <FriendSection data={friends}></FriendSection>
          </>
        )}
        {collections.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle('我的收藏')}
            <FavoriteSection data={collections}></FavoriteSection>
          </>
        )}

        {outdated.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle('以下站点无法访问，已失联')}
            <OutdateSection data={outdated}></OutdateSection>
          </>
        )}
        {banned.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle('以下站点不合规，已被禁止')}
            <BannedSection data={banned}></BannedSection>
          </>
        )}
      </article>
      <div className="pb-12"></div>
      <Footer />
    </ArticleLayout>
  )
}

const _Footer: FC = () => {
  const {
    seo,
    user: { avatar, name },
  } = useInitialData()

  const [canApply, setCanApply] = useState(false)

  useEffect(() => {
    apiClient.link.canApplyLink().then(setCanApply)
  }, [])

  if (!canApply) {
    return <h1 className="headline">主人禁止了申请友链。</h1>
  }
  return (
    <>
      <ApplyForLink key={'link'} />

      <Markdown
        key="md"
        wrapperProps={{ id: undefined, style: { whiteSpace: 'pre-line' } }}
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
        value={
          [
            `**在申请友链之前请先将本站加入贵站的友链中**`,
            `**填写邮箱后, 待通过申请后会发送邮件**`,
            `**我希望贵站不是商业化门户网站，亦或是植有影响观看体验广告的网站。**`,
            `**失联站点将会定期移除，非法网站会立即禁止并拉黑。**`,
            `<br />`,
            `**本站信息**`,
          ].join('\n\n') +
          [
            '',
            `**站点标题**: [${
              seo.title
            }](${`${location.protocol}//${location.host}`})`,
            `**站点描述**: ${seo.description}`,
            `**主人头像**: [点击下载](${avatar})`,
            `**主人名字**: ${name}`,
          ].join('\n')
        }
      />
    </>
  )
}

const Footer = NoSSR(_Footer)
FriendsView.getInitialProps = async () => {
  const { data } = await apiClient.link.getAll()

  const friends: LinkModel[] = []
  const collections: LinkModel[] = []
  const outdated: LinkModel[] = []
  const banned: LinkModel[] = []

  for (const link of data) {
    if (link.hide) {
      continue
    }

    switch (link.state) {
      case LinkState.Banned:
        banned.push(link)
        continue
      case LinkState.Outdate:
        outdated.push(link)
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

  return { friends: shuffle(friends), collections, outdated, banned }
}
export default FriendsView
