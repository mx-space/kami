import { faUser, faCalendar } from '@fortawesome/free-solid-svg-icons'
import Action, { ActionProps } from 'components/Action'
import { CommentLazy } from 'components/Comment'
import Markdown from 'components/MD-render'
import OutdateNotice from 'components/Outdate'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { observer } from 'mobx-react'
import { PostResModel, PostSingleDto } from 'models/dto/post'
import { NextSeo } from 'next-seo'
import { NextPage, NextPageContext } from 'next/'
import { useEffect, useState } from 'react'
import RemoveMarkdown from 'remove-markdown'
import { useStore } from 'store'
import { Rest } from 'utils/api'
import configs from '../../../configs'
import dayjs from 'dayjs'
import { Copyright, CopyrightProps } from '../../../build/Copyright'
export const PostView: NextPage<PostResModel> = (props) => {
  const { text, title, _id } = props
  const { userStore } = useStore()
  const name = userStore.name
  const [actions, setAction] = useState({} as ActionProps)
  const [copyrightInfo, setCopyright] = useState({} as CopyrightProps)
  const description = props.summary ?? RemoveMarkdown(props.text).slice(0, 100)

  useEffect(() => {
    setAction({
      informs: [
        {
          icon: faUser,
          name: name as string,
        },
        {
          icon: faCalendar,
          name: dayjs(props.created).format('YYYY年MM月DD日 H:mm'),
        },
      ],
      actions: [],
      copyright: props.copyright,
    })
  }, [name, props.copyright, props.created])
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
      <NextSeo
        title={props.title + ' - ' + (configs.title || appStore.title)}
        description={description}
        openGraph={{
          title: props.title,
          description: description,
          profile: { username: userStore.master.name },
        }}
      />

      <OutdateNotice time={props.modified} />
      <Markdown value={text} escapeHtml={false} showTOC={true} />
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
