import { faUser } from '@fortawesome/free-solid-svg-icons'
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
export const PostView: NextPage<PostResModel> = (props) => {
  const { text, title, _id, modified } = props
  const { userStore } = useStore()
  const name = userStore.name
  const [actions, setAction] = useState({} as ActionProps)
  const description = props.summary ?? RemoveMarkdown(props.text).slice(0, 100)
  useEffect(() => {
    setAction({
      informs: [
        {
          icon: faUser,
          name: name as string,
        },
      ],
      actions: [],
    })
  }, [name])

  return (
    <ArticleLayout title={title}>
      <NextSeo
        title={props.title}
        description={description}
        openGraph={{
          title: props.title,
          description: description,
          profile: { username: userStore.master.name },
        }}
      />

      <OutdateNotice time={modified} />
      <Markdown value={text} escapeHtml={false} showTOC={true} />
      <Action {...actions} />

      <CommentLazy type={'Post'} id={_id} />
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
