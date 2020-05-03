import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PostBlock } from 'components/PostBlock'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { PagerModel } from 'models/dto/base'
import { PostPagerDto, PostResModel } from 'models/dto/post'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useStore } from 'store'
import { Rest } from 'utils/api'
import { SEO } from '../../components/SEO'
interface Post extends PagerModel {
  posts: PostResModel[]
}

export default function Post({ posts, page }: Post) {
  const store = useStore()
  useEffect(() => {
    store.categoryStore.fetchCategory()
  })

  const router = useRouter()
  const [postList, setPosts] = useState(posts)
  const [loading, setLoading] = useState(false)
  const [pager, setPage] = useState(page)
  // const { query } = router

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

    setLoading(false)
  }
  return (
    <ArticleLayout>
      <SEO title={'博文'} />
      {/* <div className="navigation">
        <Link href={{ pathname: 'posts' }}>
          <a className="active">所有</a>
        </Link>
        <Link href={{ pathname: 'posts', query: { year: '2020' } }}>
          <a className="active">2020</a>
        </Link>
        <Link href={{ pathname: 'posts', query: { year: '2019' } }}>
          <a className="active">2019</a>
        </Link>
      </div> */}

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
              raw={post}
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
    year: parseInt(year as string) || undefined,
  })
  return { page: data.page, posts: data.data }
}
