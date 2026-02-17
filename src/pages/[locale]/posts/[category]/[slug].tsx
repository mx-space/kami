import dayjs from 'dayjs'
import { pick } from 'lodash-es'
import type { NextPage } from 'next'
import type { FC } from 'react'
import React, { lazy, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { message } from 'react-message-popup'
import { shallow } from 'zustand/shallow'

import type { PostModel } from '@mx-space/api-client'

import { usePostCollection } from '~/atoms/collections/post'
import type { ModelWithDeleted } from '~/atoms/collections/utils/base'
import { AckRead } from '~/components/common/AckRead'
import { Seo } from '~/components/app/Seo'
import { Suspense } from '~/components/app/Suspense'
import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { KamiMarkdown } from '~/components/common/KamiMarkdown'
import Outdate from '~/components/in-page/Post/Outdate'
import { PostRelated } from '~/components/in-page/Post/PostRelated'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { Banner } from '~/components/ui/Banner'
import { GgCoffee, PhBookOpen } from '~/components/ui/Icons/for-note'
import {
  FeHash,
  IonThumbsup,
  MdiCalendar,
} from '~/components/ui/Icons/for-post'
import { ImageSizeMetaContext } from '~/components/ui/Image/context'
import { Loading } from '~/components/ui/Loading'
import { NumberTransition } from '~/components/ui/NumberRecorder'
import type { ActionProps } from '~/components/widgets/ArticleAction'
import { ArticleFooterAction } from '~/components/widgets/ArticleAction'
import { Copyright } from '~/components/widgets/Copyright'
import { DonatePopover } from '~/components/widgets/Donate'
import { SearchFAB } from '~/components/widgets/Search'
import { SubscribeBell } from '~/components/widgets/SubscribeBell'
import { XLogInfoForPost } from '~/components/widgets/xLogInfo'
import { XLogSummaryForPost } from '~/components/widgets/xLogSummary'
import {
  useSetHeaderMeta,
  useSetHeaderShare,
} from '~/hooks/app/use-header-meta'
import { useInitialData, useThemeConfig } from '~/hooks/app/use-initial-data'
import { useJumpToSimpleMarkdownRender } from '~/hooks/app/use-jump-to-render'
import { useBackgroundOpacity } from '~/hooks/app/use-kami-theme'
import { useIsClient } from '~/hooks/common/use-is-client'
import { getLocaleFromContext, Link, useLocale, useRouter } from '~/i18n/navigation'
import { setRequestLocale , apiClient } from '~/utils/client'
import { isEqualObject } from '~/utils/_'
import { isLikedBefore, setLikeId } from '~/utils/cookie'
import { imagesRecord2Map } from '~/utils/images'
import { getSummaryFromMd } from '~/utils/markdown'
import { springScrollToTop } from '~/utils/spring'
import { noop } from '~/utils/utils'

const CommentLazy = lazy(() =>
  import('~/components/widgets/Comment').then((mo) => ({
    default: mo.CommentLazy,
  })),
)

const useUpdatePost = (post: ModelWithDeleted<PostModel>) => {
  const t = useTranslations('post')
  const beforeModel = useRef<PostModel>()
  const router = useRouter()

  useEffect(() => {
    const before = beforeModel.current

    if (!before && post) {
      beforeModel.current = { ...post }
      return
    }
    if (!before || !post) {
      return
    }
    if (before.id === post.id) {
      if (isEqualObject(before, post)) {
        return
      }

      if (
        before.categoryId !== post.categoryId ||
        (before.slug !== post.slug && post.category?.slug)
      ) {
        router.replace(
          '/posts/' + `${post.category.slug}/${post.slug}`,
          { shallow: true, scroll: false },
        )
        return
      }
      if (post.isDeleted) {
        router.push('/posts')

        message.error(t('deletedOrHidden'))
        return
      }
      message.info(t('updated'))
    }

    beforeModel.current = { ...post }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    post?.id,
    post?.slug,
    post?.categoryId,

    post?.text,
    post?.summary,
    post?.category?.slug,
    post?.isDeleted,
  ])
}

const Seo$: FC<{ id: string }> = ({ id }) => {
  const {
    title,
    summary,
    category,
    created,
    modified,
    tags,
    text,
    images,
    meta,
  } = usePostCollection((state) =>
    pick(state.data.get(id)!, [
      'title',
      'summary',
      'created',
      'modified',
      'category',
      'tags',
      'text',
      'images',
      'meta',
    ]),
  )
  const description = summary ?? getSummaryFromMd(text).slice(0, 150)
  return (
    <Seo
      title={title}
      description={description}
      canUseRandomImage={false}
      image={meta?.cover || images?.[0]?.src}
      openGraph={{
        type: 'article',
        article: {
          publishedTime: created,
          modifiedTime: modified || undefined,
          section: category.name,
          tags: tags ?? [],
        },
      }}
    />
  )
}

const FooterActionBar: FC<{ id: string }> = ({ id }) => {
  const t = useTranslations('post')
  const [actions, setActions] = useState<ActionProps>({})

  const post = usePostCollection(
    (state) => state.data.get(id) || (noop as PostModel),
  )

  const themeConfig = useThemeConfig()
  const donateConfig = themeConfig.function.donate
  const createTime = dayjs(post.created)
    .locale('cn')
    .format('YYYY 年 M 月 D 日')

  useEffect(() => {
    setActions({
      informs: [
        {
          icon: <MdiCalendar />,
          name: createTime,
        },
        {
          icon: <FeHash />,
          name: `${post.category.name}${
            post.tags.length ? `[${post.tags[0]}]` : ''
          }`,

          tip: () => (
            <div className="leading-7">
              <p>
                分类：
                <Link href={`/categories/${post.category.slug}`}>
                  {post.category.name}
                </Link>
              </p>
              <p>{post.tags.length ? `标签：${post.tags.join(', ')}` : ''}</p>
            </div>
          ),
        },
        {
          icon: <PhBookOpen />,
          name: post.count.read ?? 0,
        },
      ],

      actions: [
        donateConfig.enable && {
          icon: <GgCoffee />,
          name: '',
          wrapperComponent: DonatePopover,
          callback: () => {
            window.open(donateConfig.link)
          },
        },
        {
          icon: <IonThumbsup />,
          name: (
            <span className="inline-flex items-center leading-[1.1]">
              <NumberTransition number={post.count?.like || 0} />
            </span>
          ),
          color: isLikedBefore(post.id) ? '#f1c40f' : undefined,
          callback: () => {
            if (isLikedBefore(post.id)) {
              return message.error(t('alreadySupported'))
            }

            apiClient.activity.likeIt('Post', post.id).then(() => {
              message.success(t('thanksSupport'))

              setLikeId(post.id)
              usePostCollection.getState().up(post.id)
            })
          },
        },
      ],
      copyright: post.copyright,
    })
  }, [
    t,
    post.id,
    post.category.name,
    post.copyright,
    post.count.read,
    post.tags,
    donateConfig.enable,
    donateConfig.link,
    post.count.like,
    post.count,
    createTime,
    post.category.slug,
  ])

  return (
    <Suspense>
      <ArticleFooterAction {...actions} />
    </Suspense>
  )
}

const PostUpdateObserver: FC<{ id: string }> = memo(({ id }) => {
  const post = usePostCollection((state) => state.data.get(id))
  useUpdatePost(post!)
  return null
})

PostUpdateObserver.displayName = 'PostUpdateObserver'

export const PostView: PageOnlyProps = (props) => {
  const post = usePostCollection(
    (state) =>
      pick(state.data.get(props.id)!, [
        'title',
        'category',
        'id',
        'images',
        'summary',
        'created',
        'modified',
        'text',
        'copyright',
        'allowComment',
      ]),
    shallow,
  )

  const {
    url: { webUrl },
  } = useInitialData()

  useEffect(() => {
    springScrollToTop()
  }, [props.id])

  // header meta
  useSetHeaderMeta(post.title, post.category.name)
  useSetHeaderShare(post.title)

  useBackgroundOpacity(0.2)
  useJumpToSimpleMarkdownRender(post.id)

  const isClientSide = useIsClient()

  const imagesMap = useMemo(() => imagesRecord2Map(post.images), [post.images])

  return (
    <>
      <AckRead type='post' id={post.id} />
      <Seo$ id={post.id} />
      <ArticleLayout
        title={post.title}
        id={post.id}
        type="post"
        titleAnimate={false}
      >
        {post.summary ? (
          <Banner
            type="info"
            placement="left"
            showIcon={false}
            className="mb-8"
          >
            <p className="leading-[1.7]">摘要： {post.summary}</p>
          </Banner>
        ) : (
          <XLogSummaryForPost id={post.id} />
        )}
        <Outdate time={post.modified || post.created} />
        <ImageSizeMetaContext.Provider value={imagesMap}>
          <article>
            <h1 className="sr-only">{post.title}</h1>
            <KamiMarkdown codeBlockFully value={post.text} toc />
          </article>
        </ImageSizeMetaContext.Provider>

        <PostRelated id={post.id} />
        <SubscribeBell defaultType="post_c" />
        {post.copyright && isClientSide ? (
          <Copyright
            date={post.modified}
            link={new URL(location.pathname, webUrl).toString()}
            title={post.title}
          />
        ) : null}

        <XLogInfoForPost id={post.id} />
        <FooterActionBar id={post.id} />
        <Suspense>
          <CommentLazy
            key={post.id}
            id={post.id}
            allowComment={post.allowComment ?? true}
          />
        </Suspense>

        <SearchFAB />
      </ArticleLayout>

      <PostUpdateObserver id={post.id} />
    </>
  )
}

const NextPostView: NextPage<PostModel> = (props) => {
  const { id } = props
  const router = useRouter()
  const locale = useLocale()
  const prevLocale = useRef(locale)
  const postId = usePostCollection((state) => state.data.get(id)?.id)

  useEffect(() => {
    if (prevLocale.current === locale) return
    prevLocale.current = locale
    const category = router.query.category as string
    const slug = router.query.slug as string
    if (category && slug) {
      usePostCollection.getState().fetchBySlug(category, slug, locale)
    }
  }, [locale, router.query.category, router.query.slug])

  if (!postId) {
    usePostCollection.getState().add(props)
    return <Loading />
  }

  return <PostView id={id} />
}

NextPostView.getInitialProps = async (ctx) => {
  setRequestLocale(getLocaleFromContext(ctx))
  const { query } = ctx
  const { category, slug } = query as any
  const locale = getLocaleFromContext(ctx)
  const data = await usePostCollection
    .getState()
    .fetchBySlug(category, slug, locale)

  return data
}

export default wrapperNextPage(NextPostView)
