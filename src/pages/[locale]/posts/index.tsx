import { motion } from 'framer-motion'
import type { NextPage } from 'next'
import React, { Fragment, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { useRouter } from '~/i18n/navigation'
import { useLocaleFromContext } from '~/provider/locale-context'

import type { Pager, PaginateResult, PostModel } from '@mx-space/api-client'

import { Seo } from '~/components/app/Seo'
import { PostBlock } from '~/components/in-page/Post/PostBlock'
import { TagFAB } from '~/components/in-page/Post/TagFAB'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { EmptyIcon } from '~/components/ui/Icons/for-comment'
import { Loading } from '~/components/ui/Loading'
import { BottomToUpTransitionView } from '~/components/ui/Transition/BottomToUpTransitionView'
import { SearchFAB } from '~/components/widgets/Search'
import { apiClient } from '~/utils/client'
import { springScrollToTop } from '~/utils/spring'

const PostListPage: NextPage<PaginateResult<PostModel>> = () => {
  const t = useTranslations('posts')
  const [pagination, setPagination] = useState<Pager | null>(null)
  const [posts, setPosts] = useState<PostModel[]>([])

  const router = useRouter()
  const locale = useLocaleFromContext()

  const getAsPathQueryValue = (key: string) => {
    const search = router.asPath.split('?')[1]
    if (!search) return undefined
    return new URLSearchParams(search).get(key) ?? undefined
  }

  const getQueryValue = (key: string) => {
    const value = router.query[key]
    if (Array.isArray(value)) return value[0]
    return value ?? getAsPathQueryValue(key)
  }

  const getPositiveInt = (value: string | undefined, fallback?: number) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback
    return Math.floor(parsed)
  }

  const currentPage = getPositiveInt(getQueryValue('page'))

  useEffect(() => {
    springScrollToTop()
  }, [currentPage])
  useEffect(() => {
    if (!router.isReady) return
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.page, router.query.year, router.query.size, router.asPath, locale])

  const fetchPosts = async () => {
    const page = getPositiveInt(getQueryValue('page'), 1) as number
    const size = getPositiveInt(getQueryValue('size'), 10) as number
    const year = getPositiveInt(getQueryValue('year'))
    const payload = await apiClient.post.getList(page, size, {
      year,
      lang: locale,
    })
    setPagination(payload.pagination)
    setPosts(payload.data)
  }

  return (
    <ArticleLayout>
      <Seo title="博文" />

      <article key="note">
        {posts.length > 0 ? (
          <Fragment>
            {posts.map((post, i) => {
              return (
                <BottomToUpTransitionView
                  key={post.id}
                  timeout={{ enter: 66 * i }}
                >
                  <PostBlock
                    post={post}
                    onPinChange={() => {
                      fetchPosts()
                    }}
                  />
                </BottomToUpTransitionView>
              )
            })}
          </Fragment>
        ) : pagination ? (
          <div className="flex flex-col">
            <EmptyIcon />
            <p>{t('empty')}</p>
            <p>{t('emptyHint')}</p>
          </div>
        ) : (
          <Loading loadingText={t('loading')} />
        )}
      </article>

      {pagination && (
        <section className="mt-4 flex justify-between">
          {pagination.hasPrevPage ? (
            <PaginationButton
              onClick={() => {
                router.push(
                  {
                    pathname: '/posts',
                    query: { page: String(pagination.currentPage - 1) },
                  },
                  { scroll: true },
                )
              }}
            >
              {t('prevPage')}
            </PaginationButton>
          ) : (
            <div />
          )}
          {pagination.hasNextPage && (
            <PaginationButton
              onClick={() => {
                router.push(
                  {
                    pathname: '/posts',
                    query: { page: String(pagination.currentPage + 1) },
                  },
                  { scroll: true },
                )
              }}
            >
              {t('nextPage')}
            </PaginationButton>
          )}
        </section>
      )}
      <TagFAB />
      <SearchFAB />
    </ArticleLayout>
  )
}

const PaginationButton = (props: { onClick: () => void; children: string }) => {
  const { onClick, children: text } = props
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="btn !border-accent !text-accent !rounded-md !border-2 !bg-transparent"
      onClick={onClick}
    >
      {text}
    </motion.button>
  )
}

export default PostListPage
