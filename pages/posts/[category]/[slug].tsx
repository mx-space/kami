import {
  faBookOpen,
  faCalendar,
  faCoffee,
  faHashtag,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'
import { EventTypes } from 'common/socket/types'
import { useStore } from 'common/store'
import Action, { ActionProps } from 'components/Action'
import { CommentLazy } from 'components/Comment'
import Markdown from 'components/MD-render'
import { NumberRecorder } from 'components/NumberRecorder'
import OutdateNotice from 'components/Outdate'
import dayjs from 'dayjs'
import Cookie from 'js-cookie'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { PostModel, PostRespModel } from 'models/post'
import { NextPage, NextPageContext } from 'next/'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Rest } from 'utils/api'
import { imagesRecord2Map } from 'utils/images'
import { message } from 'utils/message'
import { observer } from 'utils/mobx'
import observable from 'utils/observable'
import { ImageSizeMetaContext } from '../../../common/context/ImageSizes'
import { Copyright, CopyrightProps } from '../../../components/Copyright'
import { Seo } from '../../../components/SEO'
import configs from '../../../configs'
import { getSummaryFromMd } from '../../../utils'

const ThumbsUpPrefix = 'THUMBSUP_'
const storeThumbsUpCookie = (id: string) => {
  const key = `${ThumbsUpPrefix}${id}`
  Cookie.set(key, id, { expires: 1 })
}
const isThumbsUpBefore = (id: string) => {
  const key = `${ThumbsUpPrefix}${id}`
  return !!Cookie.get(key)
}
export const PostView: NextPage<PostModel> = (props) => {
  const [{ text, title, _id }, update] = useState(props)
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
  }, [_id, text, title])

  useEffect(() => {
    const handler = (data: PostModel) => {
      if (data._id === props._id) {
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
    observable.on(EventTypes.POST_UPDATE, handler)

    return () => observable.off(EventTypes.POST_UPDATE, handler)
  }, [props._id, props.categoryId, props.slug, router])

  const [actions, setAction] = useState({} as ActionProps)
  const [copyrightInfo, setCopyright] = useState({} as CopyrightProps)
  const description =
    props.summary ?? getSummaryFromMd(props.text).slice(0, 150)
  const [thumbsUp, setThumbsUp] = useState(props.count?.like || 0)

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
        {
          icon: faCoffee,
          name: '',
          callback: () => {
            window.open(configs.donate)
          },
        },
        {
          icon: faThumbsUp,
          name: <NumberRecorder number={thumbsUp || 0} />,
          color: isThumbsUpBefore(props._id) ? '#f1c40f' : undefined,
          callback: () => {
            if (isThumbsUpBefore(props._id)) {
              return message.error('你已经支持过啦!')
            }
            Rest('Post')
              .get('_thumbs-up', {
                params: {
                  id: props._id,
                },
              })
              .then(() => {
                message.success('感谢支持!')
                storeThumbsUpCookie(props._id)
                setThumbsUp(thumbsUp + 1)
              })
          },
        },
      ],
      copyright: props.copyright,
    })
  }, [
    props._id,
    props.category.name,
    props.copyright,
    props.count.read,
    props.created,
    props.tags,
    thumbsUp,
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
        date: dayjs(props.modified).format('YYYY年MM月DD日 H:mm'),
        title,
        link: new URL(location.pathname, configs.url).toString(),
      })
    }
  }, [props, title])

  return (
    <ArticleLayout title={title} focus id={props._id} type="post">
      <Seo
        title={props.title}
        description={description}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: props.created,
            modifiedTime: props.modified,
            section: props.category.name,
            tags: props.tags ?? [],
          },
        }}
      />

      <OutdateNotice time={props.modified} />
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
        id={_id}
        allowComment={props.allowComment ?? true}
      />
    </ArticleLayout>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  try {
    const { query } = ctx
    const { category, slug } = query
    const { data } = (await Rest('Post', category as string).get(
      slug as string,
    )) as PostRespModel
    return {
      props: { ...data },
    }
  } catch {
    return {
      notFound: true,
    }
  }
}
export default observer(PostView)
