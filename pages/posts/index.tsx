import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PostBlock } from 'components/PostBlock'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { PagerModel } from 'models/dto/base'
import { PostPagerDto, PostResModel } from 'models/dto/post'
import { NextPageContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Rest } from 'utils/api'
interface Post extends PagerModel {
  posts: PostResModel[]
}

export default function Post({ posts, page }: Post) {
  const router = useRouter()
  const [postList, setPosts] = useState(posts)
  const [loading, setLoading] = useState(false)
  const [pager, setPage] = useState(page)
  const { query } = router

  const fetchNextPage = async () => {
    setLoading(true)
    const currentPage = pager.currentPage
    const { data, page } = await Rest('Post').gets<PostPagerDto>({
      page: currentPage + 1,
    })
    setPosts(postList.concat(data))
    setPage(page)
    router.push(
      '/posts/index',
      {
        pathname: 'posts',
        query: { page: currentPage + 1 },
      },
      { shallow: true },
    )
    // Router.push()
    setLoading(false)
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

      {pager.hasNextPage && (
        <section className="paul-more">
          <button className="btn brown" onClick={() => fetchNextPage()}>
            {!loading ? '下一页' : <FontAwesomeIcon icon={faSpinner} />}
          </button>
        </section>
      )}
    </ArticleLayout>
  )
}

Post.getInitialProps = async (ctx: NextPageContext) => {
  const { page, year } = ctx.query
  const data = await Rest('Post', '').gets<PostPagerDto>({
    page: ((page as any) as number) || 1,
  })
  return { page: data.page, posts: data.data }
}
