import { Pager, PaginateResult, PostModel } from '@mx-space/api-client'
import { PostBlock } from 'components/in-page/PostBlock'
import { FloatPostTagButton } from 'components/in-page/SpecialButton/float-post-tag'
import { ArticleLayout } from 'components/layouts/ArticleLayout'
import { Loading } from 'components/universal/Loading'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import { apiClient } from 'utils/client'
import { SEO } from '../../components/universal/Seo'

const PostListPage: NextPage<PaginateResult<PostModel>> = () => {
  const [pagination, setPagination] = useState<Pager | null>(null)
  const [posts, setPosts] = useState<PostModel[]>([])

  const router = useRouter()

  const {
    query: { page: currentPage },
  } = router

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])
  useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.page, router.query.year])
  const fetch = async () => {
    const { page, year, size = 10 } = router.query as any
    const payload = await apiClient.post.getList(page, size, {
      year: +year || undefined,
    })
    setPagination(payload.pagination)
    setPosts(payload.data)
  }

  return (
    <ArticleLayout>
      <SEO title={'博文'} />

      <article key={'note'}>
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
                />
              )
            })}
          </Fragment>
        ) : pagination ? (
          <div>
            <p>站长没有写过一篇文章啦</p>
            <p>稍后来看看吧!</p>
          </div>
        ) : (
          <Loading loadingText="正在加载.." />
        )}
      </article>

      {pagination && (
        <section className="kami-more">
          {pagination.hasPrevPage && (
            <button
              className="btn brown"
              onClick={() => {
                router.push(
                  '/posts?page=' + (pagination.currentPage - 1),
                  undefined,
                  { shallow: true },
                )
              }}
            >
              上一页
            </button>
          )}
          {pagination.hasNextPage && (
            <button
              className="btn brown"
              style={
                pagination.hasNextPage && pagination.hasPrevPage
                  ? { marginLeft: '6px' }
                  : undefined
              }
              onClick={() => {
                router.push(
                  '/posts?page=' + (pagination.currentPage + 1),
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
      <FloatPostTagButton />
    </ArticleLayout>
  )
}

export default PostListPage
