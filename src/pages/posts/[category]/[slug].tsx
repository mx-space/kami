import {
  faBookOpen,
  faCalendar,
  faCoffee,
  faHashtag,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'
import { PostModel } from '@mx-space/api-client'
import { useInitialData, useThemeConfig } from 'common/hooks/use-initial-data'
import { EventTypes } from 'common/socket/types'
import { useStore } from 'common/store'
import Action, { ActionProps } from 'components/Action'
import { NumberRecorder } from 'components/NumberRecorder'
import OutdateNotice from 'components/Outdate'
import dayjs from 'dayjs'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { NextPage } from 'next/'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { apiClient } from 'utils/client'
import { imagesRecord2Map } from 'utils/images'
import { message } from 'utils/message'
import { observer } from 'utils/mobx'
import { CommentLazy } from 'views/Comment'
import { Markdown } from 'views/Markdown'
import { ImageSizeMetaContext } from '../../../common/context/ImageSizes'
import { Copyright, CopyrightProps } from '../../../components/Copyright'
import { Seo } from '../../../components/SEO'
import {
  eventBus,
  getSummaryFromMd,
  isLikedBefore,
  setLikeId,
} from '../../../utils'

const storeThumbsUpCookie = (id: string) => {
  return setLikeId(id)
}
const isThumbsUpBefore = (id: string) => {
  return isLikedBefore(id)
}
export const PostView: NextPage<PostModel> = (props) => {
  const [{ text, title, id }, update] = useState(props)
  const router = useRouter()
  useEffect(() => {
    update(props)
  }, [props])

  useEffect(() => {
    appStore.shareData = {
      text,
      title,
      url: location.href,
    }
    return () => {
      appStore.shareData = null
    }
  }, [id, text, title])

  useEffect(() => {
    const handler = (data: PostModel) => {
      if (data.id === props.id) {
        if (
          data.categoryId !== props.categoryId ||
          data.slug !== props.slug ||
          data.hide
        ) {
          message.error('文章已删除或隐藏')
          router.push('/posts')
          return
        }
        message.info('文章已更新')
        update(data)
      }
    }
    eventBus.on(EventTypes.POST_UPDATE, handler)

    return () => eventBus.off(EventTypes.POST_UPDATE, handler)
  }, [props.id, props.categoryId, props.slug, router])

  const [actions, setAction] = useState({} as ActionProps)
  const [copyrightInfo, setCopyright] = useState({} as CopyrightProps)
  const description =
    props.summary ?? getSummaryFromMd(props.text).slice(0, 150)
  const [thumbsUp, setThumbsUp] = useState(props.count?.like || 0)
  const themeConfig = useThemeConfig()
  const donateConfig = themeConfig.function.donate
  const {
    url: { webUrl },
  } = useInitialData()

  useEffect(() => {
    setThumbsUp(props.count?.like || 0)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [props])
  useEffect(() => {
    setAction({
      informs: [
        {
          icon: faCalendar,
          name: dayjs(props.created).locale('cn').format('YYYY年M月DD日'),
        },
        {
          icon: faHashtag,
          name:
            props.category.name +
            `${
              props.tags && props.tags.length > 0
                ? '[' + props.tags.join('-') + ']'
                : ''
            }`,
        },
        {
          icon: faBookOpen,
          name: props.count.read ?? 0,
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
          name: <NumberRecorder number={thumbsUp || 0} />,
          color: isThumbsUpBefore(props.id) ? '#f1c40f' : undefined,
          callback: () => {
            if (isThumbsUpBefore(props.id)) {
              return message.error('你已经支持过啦!')
            }

            apiClient.post.thumbsUp(props.id).then(() => {
              message.success('感谢支持!')

              storeThumbsUpCookie(props.id)
              setThumbsUp(thumbsUp + 1)
            })
          },
        },
      ],
      copyright: props.copyright,
    })
  }, [
    props.id,
    props.category.name,
    props.copyright,
    props.count.read,
    props.created,
    props.tags,
    thumbsUp,
    donateConfig.enable,
    donateConfig.link,
  ])
  const { appStore } = useStore()

  useEffect(() => {
    appStore.headerNav = {
      title: props.title,
      meta: props.category.name,
      show: true,
    }
    return () => {
      appStore.headerNav.show = false
    }
  }, [appStore, props.category.name, props.title])

  useEffect(() => {
    if (props.copyright) {
      setCopyright({
        date: props.modified
          ? dayjs(props.modified).format('YYYY年MM月DD日 H:mm')
          : '暂没有修改过',
        title,
        link: new URL(location.pathname, webUrl).toString(),
      })
    }
  }, [props, title, webUrl])

  return (
    <ArticleLayout title={title} focus id={props.id} type="post">
      <Seo
        title={props.title}
        description={description}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: props.created,
            modifiedTime: props.modified || undefined,
            section: props.category.name,
            tags: props.tags ?? [],
          },
        }}
      />

      <OutdateNotice time={props.modified || props.created} />
      <ImageSizeMetaContext.Provider value={imagesRecord2Map(props.images)}>
        <Markdown
          codeBlockFully
          value={text}
          escapeHtml={false}
          toc
          warpperProps={{ className: 'focus' }}
        />
      </ImageSizeMetaContext.Provider>
      {props.copyright ? <Copyright {...copyrightInfo} /> : null}
      <Action {...actions} />

      <CommentLazy
        type={'Post'}
        id={id}
        allowComment={props.allowComment ?? true}
      />
    </ArticleLayout>
  )
}

PostView.getInitialProps = async (ctx) => {
  const { query } = ctx
  const { category, slug } = query as any
  const data = await apiClient.post.getPost(category, slug)

  return {
    ...data,
  }
}

export default observer(PostView)
