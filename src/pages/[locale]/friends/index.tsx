import type { NextPage } from 'next'
import type { FC } from 'react'
import { createElement } from 'react'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'

import type { LinkModel } from '@mx-space/api-client'
import { LinkState, LinkType } from '@mx-space/api-client'

import { withNoSSR } from '~/components/app/HoC/no-ssr'
import { Seo } from '~/components/app/Seo'
import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { KamiMarkdown } from '~/components/common/KamiMarkdown'
import { ApplyForLink } from '~/components/in-page/Friend/ApplyLink'
import {
  BannedSection,
  FavoriteSection,
  FriendSection,
  OutdateSection,
} from '~/components/in-page/Friend/FriendSection'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { useInitialData } from '~/hooks/app/use-initial-data'
import { getLocaleFromContext } from '~/i18n/navigation'
import { shuffle } from '~/utils/_'
import { apiClient, setRequestLocale } from '~/utils/client'

const renderTitle = (text: string) => {
  return <h1 className="headline !mt-12 !text-xl">{text}</h1>
}

const FriendsView: NextPage<
  Record<'friends' | 'collections' | 'outdated' | 'banned', LinkModel[]>
> = (props) => {
  const t = useTranslations('friends')
  const { banned, collections, friends, outdated } = props

  return (
    <ArticleLayout title={t('title')} subtitle={t('subtitle')}>
      <Seo title={t('title')} />
      <article className="article-list">
        {friends.length > 0 && (
          <>
            {collections.length !== 0 && renderTitle(t('myFriends'))}
            <FriendSection data={friends} />
          </>
        )}
        {collections.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle(t('myCollection'))}
            <FavoriteSection data={collections} />
          </>
        )}

        {outdated.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle(t('disconnected'))}
            <OutdateSection data={outdated} />
          </>
        )}
        {banned.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle(t('banned'))}
            <BannedSection data={banned} />
          </>
        )}
      </article>
      <div className="pb-12" />
      <Footer />
    </ArticleLayout>
  )
}

const Footer$: FC = () => {
  const t = useTranslations('friends')
  const {
    seo,
    user: { avatar, name },
  } = useInitialData()
  const siteUrl = typeof location !== 'undefined' ? `${location.protocol}//${location.host}` : ''

  const { data: canApply } = useSWR(
    'can-apply',
    () => apiClient.link.canApplyLink(),
    {
      refreshInterval: 10_000,
      fallbackData: true,
    },
  )

  if (!canApply) {
    return <h1 className="headline">{t('applyDisabled')}</h1>
  }
  return (
    <>
      <ApplyForLink key="link" />

      <KamiMarkdown
        key="md"
        wrapperProps={{ id: undefined, style: { whiteSpace: 'pre-line' } }}
        renderers={{
          heading: {
            react(node, output, state?) {
              return createElement(
                `h${node.level}`,
                { className: 'headline', key: state?.key },
                output(node.content, state!),
              )
            },
          },
        }}
        value={
          [
            t('applyHint1'),
            t('applyHint2'),
            t('applyHint3'),
            t('applyHint4'),
            `<br />`,
            t('siteInfo'),
          ].join('\n\n') +
          [
            '',
            t('siteTitle', { title: seo.title, url: siteUrl }),
            t('siteDesc', { desc: seo.description }),
            t('avatar', { url: avatar }),
            t('ownerName', { name }),
          ].join('\n')
        }
      />
    </>
  )
}

const Footer = withNoSSR(Footer$)
FriendsView.getInitialProps = async (ctx) => {
  setRequestLocale(getLocaleFromContext(ctx))
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
export default wrapperNextPage(FriendsView)
