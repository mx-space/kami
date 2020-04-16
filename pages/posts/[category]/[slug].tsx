import { ArticleLayout } from 'layouts/ArticleLayout'
import { PostResModel, PostSingleDto } from 'models/dto/post'
import { NextPage, NextPageContext } from 'next/'
import { Rest } from 'utils/api'
import Markdown from 'components/MD-render'

const PostView: NextPage<PostResModel> = (props) => {
  const { text, title } = props
  return (
    <ArticleLayout title={title}>
      <Markdown value={text} />
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
