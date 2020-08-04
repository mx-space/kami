import { faSpinner, faTags } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useStore } from 'common/store'
import { QueueAnim } from 'components/Anime'
import { OverLay } from 'components/Overlay'
import { PostBlock } from 'components/PostBlock'
import { BigTag } from 'components/Tag'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { observer } from 'mobx-react'
import { PagerModel } from 'models/base'
import { PostPagerDto, PostResModel, PostSingleDto } from 'models/post'
import { NextPage, NextPageContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Rest } from 'utils/api'
import { SEO } from '../../components/SEO'
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

  const [tags, setTags] = useState<{ _id: string; name: string }[]>([])
  const fetchTags = useCallback(async () => {
    const { data: tags } = (await Rest('Category').get(undefined, {
      params: {
        type: 'Tag',
      },
    })) as any
    setTags(tags)
  }, [])

  useEffect(() => {
    appStore.setActions([
      {
        icon: <FontAwesomeIcon icon={faTags} />,
        onClick: () => {
          if (tags.length == 0) {
            fetchTags()
          }
          setShowTags(true)
        },
      },
    ])

    return () => {
      appStore.resetActions()
    }
  }, [appStore, fetchTags, tags.length])
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
  const [postWithTag, setTagPost] = useState<
    Pick<
      PostSingleDto['data'],
      '_id' | 'title' | 'slug' | 'created' | 'category'
    >[]
  >([])
  const fetchPostsWithTag = useCallback(async (tagName: string) => {
    setTagPost(null!)
    const { data: posts } = (await Rest('Category').get(tagName, {
      params: {
        tag: 'true',
      },
    })) as any

    setTagPost(posts)
  }, [])

  return (
    <ArticleLayout>
      <OverLay
        show={showTags}
        onClose={() => {
          setShowTags(false)
          setTagPost([])
        }}
      >
        <div style={{ maxWidth: '50vw' }}>
          <QueueAnim type="scale">
            {tags.map(({ _id, name }) => {
              return (
                <BigTag
                  tagName={name}
                  key={_id}
                  onClick={() => {
                    fetchPostsWithTag(name)
                  }}
                />
              )
            })}
          </QueueAnim>
          <div className="tags-posts">
            <article className="post-content paul-note article-list">
              <ul>
                <QueueAnim delay={700} forcedReplay appear>
                  {postWithTag ? (
                    postWithTag.map((child) => {
                      const date = new Date(child.created)

                      return (
                        <li key={child._id}>
                          <Link
                            href={'/posts/[category]/[slug]'}
                            as={`/posts/${child.category.slug}/${child.slug}`}
                          >
                            <a>{child.title}</a>
                          </Link>
                          <span className={'meta'}>
                            {(date.getMonth() + 1).toString().padStart(2, '0')}/
                            {date.getDate().toString().padStart(2, '0')}/
                            {date.getFullYear()}
                          </span>
                        </li>
                      )
                    })
                  ) : (
                    <span>载入中.</span>
                  )}
                </QueueAnim>
              </ul>
            </article>
          </div>
        </div>
      </OverLay>

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
