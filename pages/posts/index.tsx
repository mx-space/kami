import { PostBlock } from 'components/PostBlock'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { PagerModel } from 'models/dto/base'
import { PostPagerDto, PostResModel } from 'models/dto/post'
import { NextPageContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Rest } from 'utils/api'
interface Post extends PagerModel {
  posts: PostResModel[]
}

export default function Post({ posts, page }: Post) {
  const router = useRouter()
  const { query } = router
  console.log(query.y)
  return (
    <ArticleLayout>
      <div className="navigation">
        <Link href={{ pathname: 'posts', query: { y: '2020' } }}>
          <a className="active">2020</a>
        </Link>
      </div>

      <article className="paul-note">
        {posts.map((post) => {
          const { text, created, title, _id } = post

          return (
            <PostBlock title={title} date={created} key={_id} text={text} />
          )
        })}
      </article>
    </ArticleLayout>
  )
}

Post.getInitialProps = async (ctx: NextPageContext) => {
  const data = await Rest('Post', '').gets<PostPagerDto>()
  return { page: data.page, posts: data.data }
}
