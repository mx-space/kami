import {
  faBookOpen,
  faCalendar,
  faCoffee,
  faHashtag,
  faThumbsUp,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { message } from 'antd'
import { useStore } from 'common/store'
import Action, { ActionProps } from 'components/Action'
import { CommentLazy } from 'components/Comment'
import Markdown from 'components/MD-render'
import OutdateNotice from 'components/Outdate'
import dayjs from 'dayjs'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { observer } from 'utils/mobx'
import { PostResModel, PostSingleDto } from 'models/post'
import { NextPage, NextPageContext } from 'next/'
import React, { useEffect, useState } from 'react'
import { Rest } from 'utils/api'
import { ImageSizesContext } from '../../../common/context/ImageSizes'
import { Copyright, CopyrightProps } from '../../../components/Copyright'
import { Seo } from '../../../components/SEO'
import configs from '../../../configs'
import { getSummaryFromMd } from '../../../utils'
import Cookie from 'js-cookie'
import { NumberRecorder } from 'components/NumberRecorder'

const ThumbsUpPrefix = 'THUMBSUP_'
const storeThumbsUpCookie = (id: string) => {
  const key = `${ThumbsUpPrefix}${id}`
  Cookie.set(key, id, { expires: 1 })
}
const isThumbsUpBefore = (id: string) => {
  const key = `${ThumbsUpPrefix}${id}`
  return !!Cookie.get(key)
}
export const PostView: NextPage<PostResModel> = (props) => {
  const { text, title, _id } = props
  const { userStore } = useStore()
  const name = userStore.name
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
          icon: faUser,
          name: name as string,
        },
        {
          icon: faCalendar,
          name: dayjs(props.created).format('YY/MM/DD H:mm'),
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
  }, [name, props, thumbsUp])
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
    <ArticleLayout title={title}>
      <Seo
        title={props.title}
        description={description}
        openGraph={{
          profile: { username: userStore.master.name },
          article: {
            publishedTime: props.created,
            modifiedTime: props.modified,
            section: props.category.name,
          },
        }}
      />

      <OutdateNotice time={props.modified} />
      <ImageSizesContext.Provider value={props.images}>
        <Markdown value={text} escapeHtml={false} showTOC={true} />
      </ImageSizesContext.Provider>
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

PostView.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx
  const { category, slug } = query
  const { data } = (await Rest('Post', category as string).get(
    slug as string,
  )) as PostSingleDto

  return { ...data }
}

export default observer(PostView)
