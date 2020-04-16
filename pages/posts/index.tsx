import { PostBlock } from 'components/PostBlock'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { PagerModel } from 'models/dto/base'
import { PostPagerDto, PostResModel } from 'models/dto/post'
import { NextPageContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Rest } from 'utils/api'
import { useState } from 'react'
interface Post extends PagerModel {
  posts: PostResModel[]
}

export default function Post({ posts, page }: Post) {
  const router = useRouter()
  const [postList, setPosts] = useState(posts)
  const { query } = router

  const fetchNextPage = async () => {
    const currentPage = page.currentPage
    const { data } = await Rest('Post').gets<PostPagerDto>({
      page: currentPage + 1,
    })
    setPosts(postList.concat(data))
  }

  console.log(query.y)
  return (
    <ArticleLayout>
      <div className="navigation">
        <Link href={{ pathname: 'posts', query: { y: '2020' } }}>
          <a className="active">2020</a>
        </Link>
      </div>

      <article className="paul-note">
        {postList.map((post) => {
          const { slug, text, created, title, _id } = post

          return (
            <PostBlock
              title={title}
              date={created}
              key={_id}
              text={text}
              slug={slug}
              // category={}
            />
          )
        })}
      </article>

      {page.hasNextPage && (
        <section className="paul-more">
          <button className="btn brown" onClick={() => fetchNextPage()}>
            下一页
          </button>
        </section>
      )}
    </ArticleLayout>
  )
}

Post.getInitialProps = async (ctx: NextPageContext) => {
  const data = await Rest('Post', '').gets<PostPagerDto>()
  return { page: data.page, posts: data.data }
}
