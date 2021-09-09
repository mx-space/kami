import { faTags } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { appUIStore, useStore } from 'common/store'
import { QueueAnim } from 'components/Anime'
import { Loading } from 'components/Loading'
import { OverLay } from 'components/Overlay'
import { PostBlock } from 'components/PostBlock'
import { BigTag } from 'components/Tag'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { PagerModel } from 'models/base'
import { PostModel, PostPagerDto, PostRespModel } from 'models/post'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import RcQueueAnim from 'rc-queue-anim'
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { NoSSR, UUID } from 'utils'
import { Rest } from 'utils/api'
import { observer } from 'utils/mobx'
import { SEO } from '../../components/SEO'
interface PostProps extends PagerModel {
  posts: PostModel[]
}

const Post: NextPage<PostProps> = observer((props) => {
  // const { page, posts } = props
  const [page, setPage] = useState<PagerModel['pagination'] | null>(null)
  const [posts, setPosts] = useState<PostModel[]>([])
  const store = useStore()
  const { actionStore } = store
  const [showTags, setShowTags] = useState(false)
  const router = useRouter()

  const {
    query: { page: currentPage },
  } = router

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])
  useEffect(() => {
    fetch()
  }, [router.query.page, router.query.year])
  const fetch = async () => {
    const { page, year } = router.query
    const data = await Rest('Post', '').gets<PostPagerDto>({
      page: (page as any as number) || 1,
      year: parseInt(year as string) || undefined,
    })
    setPage(data.pagination)
    setPosts(data.data)
  }

  const [tags, setTags] = useState<{ id: string; name: string }[]>([])
  const fetchTags = useCallback(async () => {
    const { data: tags } = (await Rest('Category').get(undefined, {
      params: {
        type: 'Tag',
      },
    })) as any
    setTags(tags)
  }, [])
  const actionsUUID = useMemo(() => new UUID(), [])
  useEffect(() => {
    actionStore.removeActionByUUID(actionsUUID)
    const action = {
      icon: <FontAwesomeIcon icon={faTags} />,
      id: actionsUUID,
      onClick: () => {
        if (tags.length == 0) {
          fetchTags()
        }
        setShowTags(true)
      },
    }

    actionStore.appendActions(action)

    return () => {
      actionStore.removeActionByUUID(actionsUUID)
    }
  }, [actionStore, actionsUUID, fetchTags, tags.length])

  const [postWithTag, setTagPost] = useState<
    Pick<
      PostRespModel['data'],
      'id' | 'title' | 'slug' | 'created' | 'category'
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
        blur
        darkness={0.6}
        show={showTags}
        onClose={() => {
          setShowTags(false)
          setTagPost([])
        }}
      >
        <div
          style={{
            maxWidth:
              appUIStore.viewport.w > 800 ? '50vw' : 'calc(100vw - 100px)',
          }}
          className="m-auto relative h-full"
          onClick={() => {
            setShowTags(false)
            setTagPost([])
          }}
        >
          <div
            style={{
              zIndex: 3,
              bottom: '50vh',
              top: '100px',
            }}
            className="absolute"
          >
            <QueueAnim type="scale" className="flex items-end flex-wrap">
              {tags.map(({ id, name }) => {
                return (
                  <BigTag
                    tagName={name}
                    key={id}
                    onClick={(e) => {
                      e.stopPropagation()
                      fetchPostsWithTag(name)
                    }}
                  />
                )
              })}
            </QueueAnim>
          </div>

          <div style={{ top: '50vh' }} className="bottom absolute">
            <article className="post-content kami-note article-list overlay-list">
              <style
                dangerouslySetInnerHTML={{
                  __html: `.overlay-list * {color: #fff!important;}`,
                }}
              ></style>
              <ul>
                <QueueAnim delay={700} forcedReplay appear>
                  {postWithTag ? (
                    postWithTag.map((child) => {
                      const date = new Date(child.created)

                      return (
                        <li key={child.id}>
                          <Link
                            href={'/posts/[category]/[slug]'}
                            as={`/posts/${child.category.slug}/${child.slug}`}
                          >
                            <a>{child.title}</a>
                          </Link>
                          <span className={'meta'}>
                            {Intl.DateTimeFormat('en-US').format(date)}
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
      <RcQueueAnim type={['bottom', 'alpha']}>
        <article className="kami-note" key={'note'}>
          {posts.length > 0 ? (
            <Fragment>
              {posts.map((post) => {
                const { slug, text, created, title, id } = post

                return (
                  <PostBlock
                    title={title}
                    date={created}
                    key={id}
                    text={text}
                    slug={slug}
                    raw={post}
                    // category={}
                  />
                )
              })}
            </Fragment>
          ) : page ? (
            <div>
              <p>站长没有写过一篇文章啦</p>
              <p>稍后来看看吧!</p>
            </div>
          ) : (
            <Loading loadingText="正在加载.." />
          )}
        </article>
      </RcQueueAnim>

      {page && (
        <section className="kami-more">
          {page.hasPrevPage && (
            <button
              className="btn brown"
              onClick={() => {
                router.push(
                  '/posts?page=' + (page.currentPage - 1),
                  undefined,
                  { shallow: true },
                )
              }}
            >
              上一页
            </button>
          )}
          {page.hasNextPage && (
            <button
              className="btn brown"
              style={
                page.hasNextPage && page.hasPrevPage
                  ? { marginLeft: '6px' }
                  : undefined
              }
              onClick={() => {
                router.push(
                  '/posts?page=' + (page.currentPage + 1),
                  undefined,
                  { shallow: true },
                )
              }}
            >
              下一页
            </button>
          )}
        </section>
      )}
    </ArticleLayout>
  )
})

// Post.getInitialProps = async (ctx) => {
//   const { page, year } = ctx.query

//   const data = await Rest('Post', '').gets<PostPagerDto>({
//     page: ((page as any) as number) || 1,
//     year: parseInt(year as string) || undefined,
//   })
//   return {
//     page: data.page,
//     posts: data.data,
//   }
// }
// export async function getServerSideProps(ctx: NextPageContext) {
//   try {
//     const { page, year } = ctx.query

//     const data = await Rest('Post', '').gets<PostPagerDto>({
//       page: ((page as any) as number) || 1,
//       year: parseInt(year as string) || undefined,
//     })
//     return {
//       props: { page: data.page, posts: data.data },
//     }
//   } catch {
//     return {
//       notFound: true,
//     }
//   }
// }
export default NoSSR(Post)
