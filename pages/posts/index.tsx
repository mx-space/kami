import { faSpinner, faTags } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PostBlock } from 'components/PostBlock'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { PagerModel } from 'models/base'
import { PostPagerDto, PostResModel } from 'models/post'
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useStore } from 'common/store'
import { Rest } from 'utils/api'
import { SEO } from '../../components/SEO'
import { observer } from 'mobx-react'
import { OverLay } from 'components/Overlay'
import { BigTag } from 'components/Tag'
import { QueueAnim } from 'components/Anime'
interface PostProps extends PagerModel {
  posts: PostResModel[]
}

const Post: NextPage<PostProps> = observer((props) => {
  const { page, posts } = props
  const store = useStore()
  const { appStore, categoryStore } = store
  const [showTags, setShowTags] = useState(false)
  useEffect(() => {
    categoryStore.fetchCategory()
  }, [categoryStore])
  useEffect(() => {
    appStore.setActions([
      {
        icon: <FontAwesomeIcon icon={faTags} />,
        onClick: () => {
          setShowTags(true)
        },
      },
    ])
  }, [appStore])
  const router = useRouter()
  const [postList, setPosts] = useState(posts)
  const [loading, setLoading] = useState(false)
  const [pager, setPage] = useState(page)

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
      {showTags && (
        <OverLay
          onClose={() => {
            setShowTags(false)
          }}
        >
          <QueueAnim type="scale">
            <BigTag key={'tag-1'} tagName={'tag-1'} />
            <BigTag key={'tag-12'} tagName={'tag-12'} />
            <BigTag key={'tag-13'} tagName={'tag-13'} />
            <BigTag key={'tag-14'} tagName={'tag-14'} />
            <BigTag key={'tag-15'} tagName={'tag-15'} />
          </QueueAnim>
        </OverLay>
      )}

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
})

Post.getInitialProps = async (ctx: NextPageContext) => {
  const { page, year } = ctx.query
  const data = await Rest('Post', '').gets<PostPagerDto>({
    page: ((page as any) as number) || 1,
    year: parseInt(year as string) || undefined,
  })
  return { page: data.page, posts: data.data }
}

export default Post
