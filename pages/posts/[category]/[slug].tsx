import { ArticleLayout } from 'layouts/ArticleLayout'
import { PostResModel, PostSingleDto } from 'models/dto/post'
import { NextPage, NextPageContext } from 'next/'
import { Rest } from 'utils/api'
import Markdown from 'components/MD-render'
import Action, { ActionProps } from 'components/Action'
import { useStore } from 'store'
import { faUser, faComment } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { CommentPager, CommentModel } from 'models/dto/comment'
import CommentWrap from 'components/Comment'
import { observer } from 'mobx-react'

const PostView: NextPage<PostResModel & { comments: CommentModel[] }> = (
  props,
) => {
  const { text, title, comments } = props
  const { userStore } = useStore()
  const name = userStore.name
  const [actions, setAction] = useState({} as ActionProps)

  useEffect(() => {
    Rest('Comment', 'ref')
      .get<CommentPager>(props._id)
      .then(({ data }) => {
        console.log(data)
      })
  }, [])
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
      <Markdown value={text} />
      <Action {...actions} />
      <CommentWrap comments={comments} />
    </ArticleLayout>
  )
}

PostView.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx
  const { category, slug } = query
  const { data } = (await Rest('Post', category as string).get(
    slug as string,
  )) as PostSingleDto
  let comments: CommentModel[] = []
  try {
    comments = (await Rest('Comment', 'ref').get<CommentPager>(data._id)).data
    // eslint-disable-next-line no-empty
  } catch {}
  return { ...data, comments }
}

export default observer(PostView)
