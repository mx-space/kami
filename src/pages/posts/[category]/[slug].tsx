import {
  faBookOpen,
  faCalendar,
  faCoffee,
  faHashtag,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'
import { PostModel } from '@mx-space/api-client'
import { ArticleLayout } from 'components/layouts/ArticleLayout'
import { buildStoreDataLoadableView } from 'components/universal/LoadableView'
import { Markdown } from 'components/universal/Markdown'
import { NumberRecorder } from 'components/universal/NumberRecorder'
import Outdate from 'components/universal/Outdate'
import { Seo } from 'components/universal/Seo'
import {
  ActionProps,
  ArticleFooterAction,
} from 'components/widgets/ArticleAction'
import { CommentLazy } from 'components/widgets/Comment'
import { ImageSizeMetaContext } from 'context'
import dayjs from 'dayjs'
import { useHeaderMeta, useHeaderShare } from 'hooks/use-header-meta'
import { useInitialData, useThemeConfig } from 'hooks/use-initial-data'
import { isEqual } from 'lodash-es'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { postStore, useStore } from 'store'
import { apiClient } from 'utils/client'
import { message } from 'utils/message'
import { Copyright } from '../../../components/widgets/Copyright'
import {
  getSummaryFromMd,
  imagesRecord2Map,
  isClientSide,
  isLikedBefore,
  noop,
  setLikeId,
} from '../../../utils'

const storeThumbsUpCookie = setLikeId

const isThumbsUpBefore = isLikedBefore

const useUpdatePost = (id: string) => {
  const post = postStore.get(id)
  const beforeModel = useRef<PostModel>()
  const router = useRouter()

  useEffect(() => {
    const before = beforeModel.current

    if (!before && post) {
      beforeModel.current = toJS(post)
      return
    }
    if (!before || !post) {
      return
    }
    if (before.id === post.id) {
      if (isEqual(before, post)) {
        return
      }

      if (
        before.categoryId !== post.categoryId ||
        (before.slug !== post.slug && post.category?.slug)
      ) {
        router.replace(
          '/posts/' + `${post.category.slug}/${post.slug}`,
          undefined,
          { shallow: true, scroll: false },
        )
        return
      }
      if (post.hide || post.isDeleted) {
        router.push('/posts')

        message.error('文章已删除或隐藏')
        return
      }
      message.info('文章已更新')
    }

    beforeModel.current = toJS(post)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    post?.id,
    post?.slug,
    post?.categoryId,
    post?.hide,
    post?.text,
    post?.summary,
    post?.category?.slug,
    post?.isDeleted,
  ])
}

export const PostView: PageOnlyProps = observer((props) => {
  const { postStore } = useStore()
  const post: PostModel = postStore.get(props.id) || noop

  useUpdatePost(post.id)
  const [actions, setAction] = useState({} as ActionProps)

  const description = post.summary ?? getSummaryFromMd(post.text).slice(0, 150)

  const themeConfig = useThemeConfig()
  const donateConfig = themeConfig.function.donate
  const {
    url: { webUrl },
  } = useInitialData()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [post.id])
  useEffect(() => {
    setAction({
      informs: [
        {
          icon: faCalendar,
          name: dayjs(post.created).locale('cn').format('YYYY年M月DD日'),
        },
        {
          icon: faHashtag,
          name:
            post.category.name +
            `${
              post.tags && post.tags.length > 0
                ? '[' + post.tags.join('-') + ']'
                : ''
            }`,
        },
        {
          icon: faBookOpen,
          name: post.count.read ?? 0,
        },
      ],

      actions: [
        donateConfig.enable && {
          icon: faCoffee,
          name: '',
          callback: () => {
            window.open(donateConfig.link)
          },
        },
        {
          icon: faThumbsUp,
          name: (
            <span className="leading-[1.1]">
              <NumberRecorder number={post.count?.like || 0} />
            </span>
          ),
          color: isThumbsUpBefore(post.id) ? '#f1c40f' : undefined,
          callback: () => {
            if (isThumbsUpBefore(post.id)) {
              return message.error('你已经支持过啦!')
            }

            apiClient.post.thumbsUp(post.id).then(() => {
              message.success('感谢支持!')

              storeThumbsUpCookie(post.id)
              post.count.like = post.count.like + 1
            })
          },
        },
      ],
      copyright: post.copyright,
    })
  }, [
    post.id,
    post.category.name,
    post.copyright,
    post.count.read,
    post.created,
    post.tags,
    donateConfig.enable,
    donateConfig.link,
    post.count.like,
    post.count,
  ])

  // header meta
  useHeaderMeta(post.title, post.category.name)
  useHeaderShare(post.title, post.text)

  return (
    <>
      <Seo
        title={post.title}
        description={description}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: post.created,
            modifiedTime: post.modified || undefined,
            section: post.category.name,
            tags: post.tags ?? [],
          },
        }}
      />
      <ArticleLayout title={post.title} focus id={post.id} type="post">
        {useMemo(
          () => (
            <>
              <Outdate time={post.modified || post.created} />
              <ImageSizeMetaContext.Provider
                value={imagesRecord2Map(post.images)}
              >
                <Markdown
                  codeBlockFully
                  value={post.text}
                  escapeHtml={false}
                  toc
                  wrapperProps={{ className: 'focus' }}
                />
              </ImageSizeMetaContext.Provider>
              {post.copyright && isClientSide() ? (
                <Copyright
                  date={post.modified}
                  link={new URL(location.pathname, webUrl).toString()}
                  title={post.title}
                />
              ) : null}
              <ArticleFooterAction {...actions} />

              <CommentLazy
                type={'Post'}
                id={post.id}
                allowComment={post.allowComment ?? true}
              />
            </>
          ),
          [
            actions,
            post.allowComment,
            post.copyright,
            post.created,
            post.id,
            post.images,
            post.modified,
            post.text,
            post.title,
            webUrl,
          ],
        )}
      </ArticleLayout>
    </>
  )
})
const PP = buildStoreDataLoadableView(postStore, PostView)
PP.getInitialProps = async (ctx) => {
  const { query } = ctx
  const { category, slug } = query as any
  const data = await postStore.fetchBySlug(category, slug)

  return data
}

export default PP
