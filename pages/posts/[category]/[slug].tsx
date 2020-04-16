import { ArticleLayout } from 'layouts/ArticleLayout'
import { PostResModel, PostSingleDto } from 'models/dto/post'
import { NextPage, NextPageContext } from 'next/'
import { Rest } from 'utils/api'
import Markdown from 'components/MD-render'
import Action, { ActionProps } from 'components/Action'
import { useStore } from 'store'
import { faUser, faComment } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'

const PostView: NextPage<PostResModel> = (props) => {
  const { text, title } = props
  const master = useStore()
  const name = master.userStore.name
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
  }, [])

  return (
    <ArticleLayout title={title}>
      <Markdown value={text} />
      <Action {...actions} />
    </ArticleLayout>
  )
}

PostView.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx
  const { category, slug } = query
  const { data } = (await Rest('Post', category as string).get(
    slug as string,
  )) as PostSingleDto
  return data
}

export default PostView
