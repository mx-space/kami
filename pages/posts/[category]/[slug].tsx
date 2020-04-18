import { faComment, faUser } from '@fortawesome/free-solid-svg-icons'
import Action, { ActionProps } from 'components/Action'
import CommentWrap from 'components/Comment'
import Markdown from 'components/MD-render'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { observer } from 'mobx-react'
import { CommentPager } from 'models/dto/comment'
import { PostResModel, PostSingleDto } from 'models/dto/post'
import { NextPage, NextPageContext } from 'next/'
import { useEffect, useState } from 'react'
import { useStore } from 'store'
import { Rest } from 'utils/api'

const PostView: NextPage<PostResModel> = (props) => {
  const { text, title, _id } = props
  const { userStore } = useStore()
  const name = userStore.name
  const [actions, setAction] = useState({} as ActionProps)

  useEffect(() => {
    setAction({
      informs: [
        {
          icon: faUser,
          name: name as string,
        },
      ],
      actions: [
        {
          icon: faComment,
          name: '评论',
          callback: () => {
            console.log('comment')
          },
        },
      ],
    })
  }, [name])

  return (
    <ArticleLayout title={title}>
      <Markdown value={text} escapeHtml={false} />
      <Action {...actions} />
      <CommentWrap type={'Post'} id={_id} />
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
